import subprocess
import psycopg2

# Executar os scripts ETL na ordem correta
scripts_etl = [
    "etl_csv.py",
    "etl_bdAPI.py",
    "etl_mongoDB.py",
    "etl_postgreSQL.py"
]

def deletar_tabelas(config_redshift):
    print("Deletando as tabelas do Data Warehouse (dw_argenzio)")
    conn = psycopg2.connect(**config_redshift)
    cursor = conn.cursor()

    try:
        # Deletar todas as tabelas do dw_argenzio
        cursor.execute("""
            DROP TABLE IF EXISTS dimcliente;
            DROP TABLE IF EXISTS dimentrega;
            DROP TABLE IF EXISTS dimmunicipio;
            DROP TABLE IF EXISTS dimprodutos;
            DROP TABLE IF EXISTS dimvendedor;
            DROP TABLE IF EXISTS fatovendas;
        """)
        conn.commit()
        print("Tabelas deletadas com sucesso.")
    except Exception as e:
        print(f"Erro ao deletar todas as tabelas: {e}")
    finally:
        cursor.close()
        conn.close()

def executar_scripts_etl():
    for script in scripts_etl:
        print(f"Executando {script}...")
        subprocess.run(["python3", script], check=True)
    print("Todos os scripts ETL foram executados com sucesso.\n")

def criar_fato_vendas(config_redshift):
    print("Conectando ao Redshift para criar fato_vendas...")
    conn = psycopg2.connect(**config_redshift)
    cursor = conn.cursor()

    try:
        # Criar a tabela fato_vendas (Redshift ignora as chaves estrangeiras)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS fatoVendas (
            idFatoVendas INT IDENTITY(1,1) PRIMARY KEY,
            quantidade INT,
            status VARCHAR(20),
            dataVenda DATE,
            valorTotal DECIMAL(10,2),
            dimEntrega_idEntrega INT,
            dimProdutos_idProduto INT,
            dimClientes_idCliente INT,
            dimVendedor_idVendedor INT
            );
        """)
        print("Tabela fatoVendas criada com sucesso.")
        conn.commit()


    except Exception as e:
        print(f"Erro ao criar fatoVendas: {e}")
    finally:
        cursor.close()
        conn.close()


def main():
    config_redshift = {
        'database': 'dw_argenzio',
        'user': 'redshiftadmin',
        'password': 'pigrupo5DW!#!hgf',
        'host': 'redshift-dw-pigrupo5.c98kjduserlj.us-east-2.redshift.amazonaws.com',
        'port': '5439'
    }

    deletar_tabelas(config_redshift)
    executar_scripts_etl()
    criar_fato_vendas(config_redshift)

if __name__ == "__main__":
    main()
