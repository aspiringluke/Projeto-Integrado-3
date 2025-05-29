import subprocess
import psycopg2
import mysql.connector
import pandas as pd

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
    print("Conectando ao Redshift para criar fatoVendas...")
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

def insercao_fato_vendas(config_RDS, config_redshift):
    print("Conectando ao RDS para buscar os dados necessários para popular fatoVendas...")
    conn_RDS = mysql.connector.connect(**config_RDS)
    query = """
    SELECT 
        ip.quantidade,
        ip.valorCombinado,
        p.data,
        c.idCliente as idCliente,
        p.idPedido as idPedido,
        p.status,
        pr.idProduto as idProduto,
        u.idUsuario as idUsuario
    FROM itensPedido ip
    JOIN pedidos p ON ip.Pedido_idPedido = p.idPedido
    JOIN clientes c ON p.Cliente_idCliente = c.idCliente
    JOIN produtos pr ON ip.Produto_idProduto = pr.idProduto
    JOIN usuarios u ON p.Usuario_idUsuario = u.idUsuario
    """
    df = pd.read_sql(query, conn_RDS)
    conn_Redshift = psycopg2.connect(**config_redshift)
    df_dim_cliente = pd.read_sql("SELECT idCliente FROM dimcliente", conn_Redshift)
    df_dim_entrega = pd.read_sql("SELECT idEntrega FROM dimentrega", conn_Redshift)
    df_dim_produto = pd.read_sql("SELECT idProduto FROM dimprodutos", conn_Redshift)
    df_dim_vendedor = pd.read_sql("SELECT idVendedor FROM dimvendedor", conn_Redshift)
    
    df.columns = df.columns.str.lower()
    df_dim_cliente.columns = df_dim_cliente.columns.str.lower()
    df_dim_produto.columns = df_dim_produto.columns.str.lower()
    df_dim_entrega.columns = df_dim_entrega.columns.str.lower()
    df_dim_vendedor.columns = df_dim_vendedor.columns.str.lower()

    df_merge = (
        df
        .merge(df_dim_cliente, left_on='idcliente', right_on='idcliente')
        .merge(df_dim_produto, left_on='idproduto', right_on='idproduto')
        .merge(df_dim_entrega, left_on='idpedido', right_on='identrega')
        .merge(df_dim_vendedor, left_on='idusuario', right_on='idvendedor')
    )


    df_fato = df_merge[[
    'idcliente', 'idproduto', 'identrega', 'idvendedor', 'quantidade', 'data', 'status', 'valorcombinado'
    ]].rename(columns={
        'idcliente': 'dimClientes_idCliente',
        'idproduto': 'dimProdutos_idProduto',
        'identrega': 'dimEntrega_idEntrega',
        'idvendedor': 'dimVendedor_idVendedor',
        'data': 'dataVenda',
        'valorCombinado': 'valorTotal'
    })


    cursor = conn_Redshift.cursor()
    for _, row in df_fato.iterrows():
        cursor.execute("""
            INSERT INTO FatoVendas (
                dimClientes_idCliente, dimProdutos_idProduto,
                dimEntrega_idEntrega, dimVendedor_idVendedor,
                quantidade, dataVenda, status, valorTotal
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, tuple(row))
    conn_Redshift.commit()

    cursor.close()
    conn_RDS.close()
    conn_Redshift.close()
    

def main():
    config_RDS = {
    'host': 'bd-pigrupo5-instance-1.c1kqwwuuk7em.us-east-2.rds.amazonaws.com',
    'user': 'admin',
    'password': 'gabriel19072005##',
    'database': 'sistema_vendas'
    }
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
    insercao_fato_vendas(config_RDS, config_redshift)

if __name__ == "__main__":
    main()
