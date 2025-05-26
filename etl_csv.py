# -*- coding: utf-8 -*-
import pandas as pd
import unicodedata
import numpy as np
import re
import mysql.connector
import psycopg2
import requests

# Conexão com banco de origem (RDS)
DB_ORIGEM = {
    'host': 'bd-pigrupo5-instance-1.c1kqwwuuk7em.us-east-2.rds.amazonaws.com',
    'user': 'admin',
    'password': 'gabriel19072005##',
    'database': 'sistema_vendas'
}

# Conexão com banco de destino (Redshift)
DB_DESTINO = {
    'host': 'redshift-dw-pigrupo5.c98kjduserlj.us-east-2.redshift.amazonaws.com',
    'port': 5439,
    'user': 'redshiftadmin',
    'password': 'pigrupo5DW!#!hgf',
    'database': 'dw_argenzio'
}
# Conectar ao banco destino (DW)
def conectar_dw():
    return psycopg2.connect(
        host=DB_DESTINO['host'],
        port=DB_DESTINO['port'],
        user=DB_DESTINO['user'],
        password=DB_DESTINO['password'],
        dbname=DB_DESTINO['database']
    )

# Conectar ao banco origem (sistema_vendas)
def conectar_bdAPI():
    return mysql.connector.connect(**DB_ORIGEM)

def garantir_tabela_dimmunicipio():
    print("Verificando/criando tabela dimmunicipio no Redshift...")
    conn = conectar_dw()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS dimmunicipio (
            idIBGE INTEGER PRIMARY KEY,
            nome VARCHAR(100),
            rendaPerCapita DECIMAL(12,2)
        )
    """)
    conn.commit()
    cursor.close()
    conn.close()


# Buscar informações do ViaCEP
def buscar_info_cep(CEP):
    try:
        response = requests.get(f'https://viacep.com.br/ws/{CEP}/json/')
        if response.status_code == 200:
            dados = response.json()
            if 'erro' not in dados and 'ibge' in dados:
                return {
                    'idIBGE': int(dados['ibge']),
                    'nome': dados['localidade']
                }
    except Exception as e:
        print(f"Erro ao buscar CEP {CEP}: {e}")
    return None

# Buscar os CEPs da tabela clientes
def carregar_ceps_clientes():
    print("Carregando CEPs dos clientes...")
    conn = conectar_bdAPI()
    query = "SELECT DISTINCT CEP FROM clientes WHERE CEP IS NOT NULL AND CEP != ''"
    df = pd.read_sql(query, conn)
    conn.close()
    df['CEP'] = df['CEP'].str.replace('-', '').str.strip()
    return df

# Carregar o CSV de renda per capita
def carregar_csv_renda(caminho_arquivo):
    df = pd.read_csv(caminho_arquivo, encoding='latin1', sep=';', dtype=str)
    df = df.rename(columns={
        'cod_ibge': 'idIBGE',
        'municipios': 'nome',
        'renda_per_capita': 'rendaPerCapita'
    })
    df['idIBGE'] = df['idIBGE'].astype(int)
    df['rendaPerCapita'] = pd.to_numeric(df['rendaPerCapita'], errors='coerce').fillna(0)
    return df

# Função de limpeza de texto
def limpar_texto(texto):
    texto = ''.join(c for c in unicodedata.normalize('NFKD', str(texto)) if not unicodedata.combining(c))
    return re.sub(r'[^A-Za-z0-9!?@#₢¹,.: ]', '', texto)

# Aplicar limpeza geral aos dados
def limpar_dados(df):
    print("Iniciando limpeza de dados...")
    for col in df.columns:
        print(f"Limpando coluna: {col}")
        df[col] = df[col].astype(str).str.strip().str.title()
        if col.lower() in ['nome']:
            df[col] = df[col].apply(lambda x: limpar_texto(x))
        else:
            df[col] = df[col].apply(lambda x: limpar_texto(x).replace(' ', ''))

    for col in df.columns:
        df[col] = df[col].replace([None, 'NULL', 'null', 'nan', 'NaN', ''], np.nan)
        if df[col].dtype == object:
            df[col] = df[col].fillna('Desconhecido')
        else:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)

    if 'rendaPerCapita' in df.columns:
        df['rendaPerCapita'] = pd.to_numeric(df['rendaPerCapita'], errors='coerce').fillna(0)

    print("Limpeza concluída.\n")
    return df

# Inserir os dados no DW
def inserir_dimmunicipio(data):
    print("Inserindo dados em dimmunicipio...")
    conn = conectar_dw()
    cursor = conn.cursor()
    erros = 0

    for _, row in data.iterrows():
        try:
            cursor.execute("DELETE FROM dimmunicipio WHERE idIBGE = %s", (int(row['idIBGE']),))
            cursor.execute("""
                INSERT INTO dimmunicipio (idIBGE, nome, rendaPerCapita)
                VALUES (%s, %s, %s)
            """, (int(row['idIBGE']), row['nome'], float(row['rendaPerCapita'])))
        except Exception as e:
            erros += 1
            print(f"Erro ao inserir {row.to_dict()}: {e}")

    conn.commit()
    cursor.close()
    conn.close()
    print(f"Inserção finalizada. {len(data) - erros} inseridos com sucesso, {erros} com erro.\n")

# ETL principal
def executar_etl():
    print("===== INÍCIO DO PROCESSO ETL =====\n")
    garantir_tabela_dimmunicipio()

    # Carrega dados do CSV
    csv_path = '/home/ec2-user/codigos_municipios_regioes.csv'
    df_renda = carregar_csv_renda(csv_path)

    # Carrega CEPs dos clientes e consulta ViaCEP
    df_ceps = carregar_ceps_clientes()
    municipios = []
    ibges_existentes = set()

    for _, row in df_ceps.iterrows():
        info = buscar_info_cep(row['CEP'])
        if info and info['idIBGE'] not in ibges_existentes:
            municipios.append(info)
            ibges_existentes.add(info['idIBGE'])

    df_municipios = pd.DataFrame(municipios)
    df_municipios = df_municipios.merge(df_renda, on='idIBGE', how='left')

    # Resolve conflito de colunas 'nome'
    if 'nome_x' in df_municipios.columns and 'nome_y' in df_municipios.columns:
        df_municipios['nome'] = df_municipios['nome_x']
        df_municipios = df_municipios.drop(columns=['nome_x', 'nome_y'])

    df_final = limpar_dados(df_municipios)
    inserir_dimmunicipio(df_final)
    print("===== ETL FINALIZADO =====")

# Rodar
executar_etl()
