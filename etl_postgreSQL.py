import psycopg2
import pandas as pd

# Extrair dados do PostgreSQL (fonte)
def extrair_dados_postgres(config_pgsql):
    print("Conectando ao PostgreSQL (origem)...")
    conn = psycopg2.connect(**config_pgsql)
    query = """
        SELECT n."idProduto", n."codNCM", v.tempo_validade 
        FROM "NCM" n 
        JOIN "validade_produto" v ON n."idProduto" = v."idProduto";
    """
    df = pd.read_sql(query, conn)
    conn.close()
    print(f"{len(df)} registros extraídos do PostgreSQL.\n")
    return df

# Atualizar dados no PostgreSQL (DW)
def atualizar_dimprodutos_postgres(df, config_dw):
    print("Conectando ao Redshift/PostgreSQL (DW)...")
    conn = psycopg2.connect(**config_dw)
    cursor = conn.cursor()

    erros = 0
    for _, row in df.iterrows():
        try:
            cod_ncm = str(row['codNCM']) if pd.notnull(row['codNCM']) else None
            tempo_validade = int(row['tempo_validade']) if pd.notnull(row['tempo_validade']) else None
            id_produto = int(row['idProduto'])

            cursor.execute("""
            UPDATE dimprodutos
            SET codNCM = %s,
            tempo_validade = %s
            WHERE idProduto = %s
            """, (cod_ncm, tempo_validade, id_produto))

        except Exception as e:
            erros += 1
            print(f"Erro ao atualizar produto {row['idProduto']}: {e}")

    conn.commit()
    cursor.close()
    conn.close()
    print(f"Atualização concluída. {len(df) - erros} atualizados com sucesso, {erros} com erro.\n")

# Função principal
def main():
    # Configuração PostgreSQL origem (EC2)
    config_pgsql_origem = {
        'dbname': 'rastreabilidade',
        'user': 'postgres',
        'password': 'gabriel19072005#',
        'host': '3.145.179.92',
        'port': '5432'
    }

    # Configuração Redshift/DW destino
    config_dw = {
        'database': 'dw_argenzio',
        'user': 'redshiftadmin',
        'password': 'pigrupo5DW!#!hgf',
        'host': 'redshift-dw-pigrupo5.c98kjduserlj.us-east-2.redshift.amazonaws.com',
        'port': '5439'
    }

    df = extrair_dados_postgres(config_pgsql_origem)
    atualizar_dimprodutos_postgres(df, config_dw)

if __name__ == "__main__":
    main()

