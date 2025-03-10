CREATE DATABASE sistema_vendas;
USE sistema_vendas;

DROP TABLE IF EXISTS vendedor;
-- Tabela de Vendedores
CREATE TABLE vendedor (
    idVendedor INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS administrador;
-- Tabela de Administradores
CREATE TABLE administrador (
    idAdmin INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS cliente;
-- Tabela de Clientes
CREATE TABLE cliente (
    idCliente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    CNPJ VARCHAR(18) UNIQUE NOT NULL,  -- Pode ser CPF ou CNPJ
    endereco VARCHAR(255) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL
);

DROP TABLE IF EXISTS produto;
-- Tabela de Produtos
CREATE TABLE produto (
    idProduto INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    valorUnitario DECIMAL(10,2) NOT NULL
);

DROP TABLE IF EXISTS pedido;
-- Tabela de Pedidos
CREATE TABLE pedido (
    idPedido INT AUTO_INCREMENT PRIMARY KEY,
    status ENUM('Pendente', 'Aprovado', 'Cancelado') NOT NULL DEFAULT 'Pendente',
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    idVendedor INT NOT NULL,
    FOREIGN KEY (idVendedor) REFERENCES vendedor(idVendedor) ON DELETE CASCADE
);

DROP TABLE IF EXISTS itemPedido;
-- Itens do Pedido (N:M entre Pedido e Produto)
CREATE TABLE itemPedido (
    idItemPedido INT AUTO_INCREMENT PRIMARY KEY,
    idPedido INT NOT NULL,
    idProduto INT NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    valorCombinado DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (idPedido) REFERENCES pedido(idPedido) ON DELETE CASCADE,
    FOREIGN KEY (idProduto) REFERENCES produto(idProduto) ON DELETE CASCADE
);
