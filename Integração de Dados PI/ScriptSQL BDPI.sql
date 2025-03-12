-- Criando banco 'sistema_vendas'
CREATE DATABASE sistema_vendas;
-- Colocando o banco em uso
USE sistema_vendas;

-- Desativando temporariamente a verificação de chaves estrangeiras
SET FOREIGN_KEY_CHECKS = 0;

-- Dropar as tabelas(qualuer ordem)
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS produtos;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS itenspedido;

-- Reativar a verificação de chaves estrangeiras
SET FOREIGN_KEY_CHECKS = 1;

-- Criando a tablea 'usuarios'
CREATE TABLE usuarios (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(20) NOT NULL,
    tipo ENUM('admin', 'vendedor') NOT NULL
);

-- Criando a tablea 'clientes'
CREATE TABLE clientes (
    idCliente INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL,
    CNPJ VARCHAR(20) NOT NULL UNIQUE,
    endereco VARCHAR(45),
    cidade VARCHAR(100),
    telefone VARCHAR(20)
);

-- Criando a tablea 'produtos'
CREATE TABLE produtos (
    idProduto INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(60) NOT NULL,
    descricao TEXT,
    valorUnitario DECIMAL(10,2) NOT NULL
);

-- Criando a tablea 'pedidos'
CREATE TABLE pedidos (
    idPedido INT PRIMARY KEY AUTO_INCREMENT,
    idUsuario INT NOT NULL,
    idCliente INT NOT NULL,
    status ENUM('pendente', 'concluído') NOT NULL,
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario) ON DELETE CASCADE,
    FOREIGN KEY (idCliente) REFERENCES clientes(idCliente) ON DELETE CASCADE
);

-- Criando a tablea 'itensPedido'
CREATE TABLE itensPedido (
    idItemPedido INT PRIMARY KEY AUTO_INCREMENT,
    idPedido INT NOT NULL,
    idProduto INT NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    valorCombinado DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (idPedido) REFERENCES pedidos(idPedido) ON DELETE CASCADE,
    FOREIGN KEY (idProduto) REFERENCES produtos(idProduto) ON DELETE CASCADE
);
