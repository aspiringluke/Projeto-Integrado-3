import mysql.connector
import psycopg2
import pandas as pd
import numpy as np
import re
import unicodedata

DB_ORIGEM = {
    'host': 'bd-pigrupo5-instance-1.c1kqwwuuk7em.us-east-2.rds.amazonaws.com',
    'user': 'admin',
    'password': 'gabriel19072005##',
    'database': 'sistema_vendas'
}

DB_DESTINO = {
    'host': 'redshift-dw-pigrupo5.c98kjduserlj.us-east-2.redshift.amazonaws.com',
    'port': 5439,
    'user': 'redshiftadmin',
    'password': 'pigrupo5DW!#!hgf',
    'database': 'dw_argenzio'
}

def conectar_mysql(config):
    return mysql.connector.connect(**config)

def conectar_redshift(config):
    return psycopg2.connect(
        host=config['host'],
        port=config['port'],
        user=config['user'],
        password=config['password'],
        dbname=config['database']
    )

def garantir_tabelas_redshift():
    print("Verificando/criando tabelas no Redshift...")
    conn = conectar_redshift(DB_DESTINO)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS dimcliente (
            idCliente INT PRIMARY KEY,
            nome VARCHAR(45) NOT NULL,
            cnpj VARCHAR(20) NOT NULL,
            CEP VARCHAR(45),
            telefone VARCHAR(15)
        );
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS dimprodutos (
            idProduto INT PRIMARY KEY,
            codNCM VARCHAR(20) NOT NULL,
            descricao VARCHAR(60) NOT NULL,
            unidade VARCHAR(10) NOT NULL,
            valorUnitario DECIMAL(10,2) NOT NULL,
            tempo_validade INT NOT NULL
        );
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS dimvendedor (
            idVendedor INT PRIMARY KEY,
            nome VARCHAR(45)
        );
    """)

    conn.commit()
    cursor.close()
    conn.close()
    print("Tabelas verificadas/criadas com sucesso.\n")

def limpar_texto(texto):
    texto = ''.join(c for c in unicodedata.normalize('NFKD', str(texto)) if not unicodedata.combining(c))
    return re.sub(r'[^A-Za-z0-9!?@#₢¹,.: ]', '', texto)

def limpar_dados(df_clientes, df_produtos, df_vendedores):
    print("Limpando dados (clientes)...")
    for col in df_clientes.columns:
        df_clientes[col] = df_clientes[col].astype(str).str.strip().str.title()
        if col.lower() in ['nome', 'cep']:
            df_clientes[col] = df_clientes[col].apply(limpar_texto)
        else:
            df_clientes[col] = df_clientes[col].apply(lambda x: limpar_texto(x).replace(' ', ''))
    for col in df_clientes.columns:
        df_clientes[col] = df_clientes[col].replace([None, 'NULL', 'null', 'nan', 'NaN', ''], np.nan)
        if df_clientes[col].dtype == object:
            df_clientes[col] = df_clientes[col].fillna('Não Informado')
        else:
            df_clientes[col] = pd.to_numeric(df_clientes[col], errors='coerce').fillna(0)

    print("Limpando dados (produtos)...")
    for col in df_produtos.columns:
        df_produtos[col] = df_produtos[col].astype(str).str.strip().str.title()
        if col.lower() == 'descricao':
            df_produtos[col] = df_produtos[col].apply(limpar_texto)
        else:
            df_produtos[col] = df_produtos[col].apply(lambda x: limpar_texto(x).replace(' ', ''))
    for col in df_produtos.columns:
        df_produtos[col] = df_produtos[col].replace([None, 'NULL', 'null', 'nan', 'NaN', ''], np.nan)
        if df_produtos[col].dtype == object:
            df_produtos[col] = df_produtos[col].fillna('Não Informado')
        else:
            df_produtos[col] = pd.to_numeric(df_produtos[col], errors='coerce').fillna(0)

    print("Limpando dados (vendedores)...")
    for col in df_vendedores.columns:
        df_vendedores[col] = df_vendedores[col].astype(str).str.strip().str.title()
        if col.lower() == 'nome':
            df_vendedores[col] = df_vendedores[col].apply(limpar_texto)
        else:
            df_vendedores[col] = df_vendedores[col].apply(lambda x: limpar_texto(x).replace(' ', ''))
    for col in df_vendedores.columns:
        df_vendedores[col] = df_vendedores[col].replace([None, 'NULL', 'null', 'nan', 'NaN', ''], np.nan)
        if df_vendedores[col].dtype == object:
            df_vendedores[col] = df_vendedores[col].fillna('Não Informado')
        else:
            df_vendedores[col] = pd.to_numeric(df_vendedores[col], errors='coerce').fillna(0)

    print("Limpeza concluída.\n")
    return df_clientes, df_produtos, df_vendedores

def ler_dados_origem():
    print("Lendo dados do banco origem (Aurora/RDS)...")
    conn = conectar_mysql(DB_ORIGEM)
    df_clientes = pd.read_sql("SELECT idCliente, nome, CNPJ, cep, telefone FROM clientes;", conn)
    df_clientes = df_clientes.rename(columns={'CNPJ': 'cnpj', 'cep': 'CEP'})
    print(f"{len(df_clientes)} clientes carregados.")

    df_produtos = pd.read_sql("SELECT idProduto, descricao, unidade, valorUnitario FROM produtos;", conn)
    print(f"{len(df_produtos)} produtos carregados.")

    df_vendedores = pd.read_sql("SELECT idUsuario AS idVendedor, nome FROM usuarios WHERE Funcao_idFuncao = 2;", conn)
    print(f"{len(df_vendedores)} vendedores carregados.")

    conn.close()
    return df_clientes, df_produtos, df_vendedores

def inserir_dados_dw(df_clientes, df_produtos, df_vendedores):
    conn = conectar_redshift(DB_DESTINO)
    cursor = conn.cursor()

    # Função auxiliar para UPSERT simples (delete + insert)
    def upsert(table, pk_col, columns, rows):
        for row in rows:
            pk_value = row[columns.index(pk_col)]
            try:
                cursor.execute(f"DELETE FROM {table} WHERE {pk_col} = %s;", (pk_value,))
                placeholders = ', '.join(['%s'] * len(columns))
                col_names = ', '.join(columns)
                cursor.execute(
                    f"INSERT INTO {table} ({col_names}) VALUES ({placeholders});",
                    row
                )
            except Exception as e:
                print(f"Erro ao inserir/upsert na tabela {table}, linha {row}: {e}")

    print("Inserindo dados em dimcliente...")
    clientes_rows = [
        (int(row['idCliente']), row['nome'], row['cnpj'], row['CEP'], row['telefone'])
        for _, row in df_clientes.iterrows()
    ]
    upsert('dimcliente', 'idCliente', ['idCliente', 'nome', 'cnpj', 'CEP', 'telefone'], clientes_rows)
    conn.commit()
    print("dimcliente atualizada.\n")

    print("Inserindo dados em dimprodutos...")
    produtos_rows = [
        (int(row['idProduto']), 0, row['descricao'], row['unidade'],
         float(row['valorUnitario']) if not pd.isnull(row['valorUnitario']) else None,
         -1)
        for _, row in df_produtos.iterrows()
    ]
    upsert('dimprodutos', 'idProduto', ['idProduto', 'codNCM', 'descricao', 'unidade', 'valorUnitario', 'tempo_validade'], produtos_rows)
    conn.commit()
    print("dimprodutos atualizada.\n")

    print("Inserindo dados em dimvendedor...")
    vendedores_rows = [
        (int(row['idVendedor']), row['nome'])
        for _, row in df_vendedores.iterrows()
    ]
    upsert('dimvendedor', 'idVendedor', ['idVendedor', 'nome'], vendedores_rows)
    conn.commit()
    print("dimvendedor atualizada.\n")

    cursor.close()
    conn.close()

def executar_etl():
    print("===== INÍCIO DO PROCESSO ETL =====\n")
    garantir_tabelas_redshift()
    df_clientes, df_produtos, df_vendedores = ler_dados_origem()
    df_clientes, df_produtos, df_vendedores = limpar_dados(df_clientes, df_produtos, df_vendedores)
    inserir_dados_dw(df_clientes, df_produtos, df_vendedores)
    print("===== ETL FINALIZADO =====")

if __name__ == "__main__":
    executar_etl()
