from pymongo import MongoClient
import pandas as pd
import psycopg2

# Conexão com Redshift
config_redshift = {
    'host': 'redshift-dw-pigrupo5.c98kjduserlj.us-east-2.redshift.amazonaws.com',
    'port': 5439,
    'user': 'redshiftadmin',
    'password': 'pigrupo5DW!#!hgf',
    'database': 'dw_argenzio'
}

def conectar_redshift():
    return psycopg2.connect(**config_redshift)

# Função para garantir que a tabela exista no Redshift
def garantir_tabela(conn):
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS dimentrega (
            idEntrega INTEGER,
            tempoEntrega VARCHAR(10),
            custoMotorista DECIMAL(10, 2),
            custoAjudante DECIMAL(10, 2),
            custoCombustivel DECIMAL(10, 2),
            quilometroRodado INTEGER,
            custoCaminhao DECIMAL(10, 2)
        );
    """)
    conn.commit()
    cursor.close()

# Extrair dados do MongoDB
def extrair_dados_mongo(uri, nome_banco, nome_collection):
    print("Conectando ao MongoDB...")
    client = MongoClient(uri)
    db = client[nome_banco]
    collection = db[nome_collection]

    print(f"Extraindo dados da collection '{nome_collection}'...")
    documentos = list(collection.find()) 
    df = pd.DataFrame(documentos)
    return df

# Transformar dados
def transformar_dados(df):
    print("Iniciando transformação dos dados...")
    df["tempoEntrega"] = df["tempoEntrega"].apply(lambda x: str(x).split(" ")[-1] if pd.notnull(x) else None)
    print("Transformação concluída.\n")
    return df

# Carregar dados no Redshift
def carregar_dados_redshift(df):
    print("Conectando ao Redshift...")
    conn = conectar_redshift()

    garantir_tabela(conn)
    cursor = conn.cursor()

    for _, row in df.iterrows():
        try:
            # Remove duplicatas antes de inserir (opcional, pode ser otimizado)
            cursor.execute("DELETE FROM dimentrega WHERE idEntrega = %s", (int(row['idEntrega']),))
            cursor.execute("""
                INSERT INTO dimentrega (idEntrega, tempoEntrega, custoMotorista, custoAjudante, custoCombustivel, quilometroRodado, custoCaminhao)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (
                int(row['idEntrega']),
                str(row["tempoEntrega"]) if pd.notnull(row["tempoEntrega"]) else None,
                float(row['custoMotorista']),
                float(row['custoAjudante']),
                float(row['custoCombustivel']),
                int(row['quilometroRodado']),
                float(row['custoCaminhao'])
            ))
        except Exception as e:
            print(f"Erro ao inserir entrega: {e}")

    conn.commit()
    cursor.close()
    conn.close()
    print("Inserção concluída com sucesso.")

# === Função principal ===
def main():
    # Dados do MongoDB
    mongo_uri = "mongodb+srv://gabriel20:gabriel2019072005@cluster0.g9cs7qv.mongodb.net/"
    nome_banco_mongo = "DimEntrega"
    nome_collection = "dimentrega"

    # Pipeline ETL
    df = extrair_dados_mongo(mongo_uri, nome_banco_mongo, nome_collection)
    df = transformar_dados(df)
    carregar_dados_redshift(df)

if __name__ == "__main__":
    main()
