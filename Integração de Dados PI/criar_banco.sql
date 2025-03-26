use teste_banco_api;

-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema teste_banco_api
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema teste_banco_api
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `teste_banco_api` DEFAULT CHARACTER SET utf8 ;
USE `teste_banco_api` ;

-- -----------------------------------------------------
-- Table `teste_banco_api`.`funcao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `teste_banco_api`.`funcao` (
  `idfuncao` INT NOT NULL AUTO_INCREMENT,
  `descricao` VARCHAR(45) NULL,
  PRIMARY KEY (`idfuncao`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `teste_banco_api`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `teste_banco_api`.`usuarios` (
  `idusuarios` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  `senha` VARCHAR(20) NULL,
  `funcao_idfuncao` INT NOT NULL,
  PRIMARY KEY (`idusuarios`),
  INDEX `fk_usuarios_funcao_idx` (`funcao_idfuncao` ASC) VISIBLE,
  CONSTRAINT `fk_usuarios_funcao`
    FOREIGN KEY (`funcao_idfuncao`)
    REFERENCES `teste_banco_api`.`funcao` (`idfuncao`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `teste_banco_api`.`pedidos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `teste_banco_api`.`pedidos` (
  `idpedidos` INT NOT NULL AUTO_INCREMENT,
  `status` CHAR(10) NULL,
  `data` DATE NULL,
  PRIMARY KEY (`idpedidos`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `teste_banco_api`.`produtos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `teste_banco_api`.`produtos` (
  `idprodutos` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NULL,
  `descricao` VARCHAR(45) NULL,
  `valorUnitario` FLOAT NULL,
  PRIMARY KEY (`idprodutos`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `teste_banco_api`.`itensPedido`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `teste_banco_api`.`itensPedido` (
  `pedidos_idpedidos` INT NOT NULL,
  `produtos_idprodutos` INT NOT NULL,
  `idItem` INT NOT NULL AUTO_INCREMENT,
  `quantidade` FLOAT NULL,
  `valor` FLOAT NULL,
  INDEX `fk_pedidos_has_produtos_produtos1_idx` (`produtos_idprodutos` ASC) VISIBLE,
  INDEX `fk_pedidos_has_produtos_pedidos1_idx` (`pedidos_idpedidos` ASC) VISIBLE,
  PRIMARY KEY (`idItem`),
  CONSTRAINT `fk_pedidos_has_produtos_pedidos1`
    FOREIGN KEY (`pedidos_idpedidos`)
    REFERENCES `teste_banco_api`.`pedidos` (`idpedidos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_pedidos_has_produtos_produtos1`
    FOREIGN KEY (`produtos_idprodutos`)
    REFERENCES `teste_banco_api`.`produtos` (`idprodutos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


insert into pedidos (status,data) values
("aberto","2025-02-12"),
("fechado","2025-03-30"),
("fechado","025-01-05"),
("aberto","2025-04-11"),
("fechado","2025-01-20");

insert into produtos (nome,descricao,valorUnitario) values
("leite","leite integral de vaca",4.50),
("queijo musarela","pessa de queijo musarela de 200 gramas","12"),
("iogurte de morango","garafa de iogurte sabor morango de 200 ml",15),
("manteiga","pote de manteiga de 100 ml",15),
("requeijão","pote de requeijão de 100 ml",12);


insert into funcao (descricao) values
("vendedor"),
("admin");


insert into itenspedido (pedidos_idpedidos,produtos_idprodutos,quantidade,valor) values
(1,2,2,24),
(2,3,1,15),
(3,1,4,18),
(4,4,2,30),
(5,5,3,36);


insert into usuarios (nome,email,senha,funcao_idfuncao) values
("jose carlos","josecarlos@gmail","1357900",1),
("luiz antonio","luizantonio@gmail",1245688,1),
("pedro lucas","pedrolucas@gmail",45612390,1),
("gilson araujo","gilsonaraujo@gmail",77266346,2);


