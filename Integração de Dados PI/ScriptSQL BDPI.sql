CREATE DATABASE sistema_vendas;
USE sistema_vendas;

DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(20) NOT NULL,
    tipo ENUM('admin', 'vendedor') NOT NULL
);

DROP TABLE IF EXISTS clientes;
CREATE TABLE clientes (
    idCliente INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL,
    CNPJ VARCHAR(20) NOT NULL UNIQUE,
    endereco VARCHAR(45),
    cidade VARCHAR(100),
    telefone VARCHAR(20)
);

DROP TABLE IF EXISTS produtos;
CREATE TABLE produtos (
    idProduto INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(60) NOT NULL,
    descricao TEXT,
    valorUnitario DECIMAL(10,2) NOT NULL
);

DROP TABLE IF EXISTS pedidos;
CREATE TABLE pedidos (
    idPedido INT PRIMARY KEY AUTO_INCREMENT,
    idUsuario INT NOT NULL,
    idCliente INT NOT NULL,
    status ENUM('pendente', 'concluído') NOT NULL,
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario) ON DELETE CASCADE,
    FOREIGN KEY (idCliente) REFERENCES clientes(idCliente) ON DELETE CASCADE
);

DROP TABLE IF EXISTS itensPedido;
CREATE TABLE itensPedido (
    idItemPedido INT PRIMARY KEY AUTO_INCREMENT,
    idPedido INT NOT NULL,
    idProduto INT NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    valorCombinado DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (idPedido) REFERENCES pedidos(idPedido) ON DELETE CASCADE,
    FOREIGN KEY (idProduto) REFERENCES produtos(idProduto) ON DELETE CASCADE
);
