SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema bd_gerenciamento_de_estoque
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `bd_gerenciamento_de_estoque` DEFAULT CHARACTER SET utf8;
USE `bd_gerenciamento_de_estoque`;

-- -----------------------------------------------------
-- Table `bd_gerenciamento_de_estoque`.`tb_tipo_funcionario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bd_gerenciamento_de_estoque`.`tb_tipo_funcionario` (
  `cd_tipo_funcionario` INT NOT NULL AUTO_INCREMENT,
  `nm_tipo_funcionario` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`cd_tipo_funcionario`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `bd_gerenciamento_de_estoque`.`tb_funcionario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bd_gerenciamento_de_estoque`.`tb_funcionario` (
  `cd_funcionario` INT NOT NULL AUTO_INCREMENT,
  `nm_funcionario` VARCHAR(60) NOT NULL,
  `nm_email` VARCHAR(60) NOT NULL,
  `cd_senha` VARCHAR(80) NOT NULL,
  `st_usuario` CHAR(1) NOT NULL,
  `dt_registro_usuario` DATETIME NULL,
  `id_tipo_funcionario` INT NOT NULL,
  PRIMARY KEY (`cd_funcionario`),
  UNIQUE INDEX `nm_email_UNIQUE` (`nm_email`),
  INDEX `fk_tb_funcionario_tb_tipo_funcionario_idx` (`id_tipo_funcionario`),
  CONSTRAINT `fk_tb_funcionario_tb_tipo_funcionario`
    FOREIGN KEY (`id_tipo_funcionario`)
    REFERENCES `bd_gerenciamento_de_estoque`.`tb_tipo_funcionario` (`cd_tipo_funcionario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `chk_st_usuario` CHECK (`st_usuario` IN ('1', '2', '3'))
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `bd_gerenciamento_de_estoque`.`tb_produto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bd_gerenciamento_de_estoque`.`tb_produto` (
  `cd_produto` INT NOT NULL AUTO_INCREMENT,
  `nm_produto` VARCHAR(45) NOT NULL,
  `ds_produto` LONGTEXT NOT NULL,
  `vl_produto` DECIMAL(6,2) NOT NULL,
  `qt_produto` INT NOT NULL,
  `id_funcionario` INT NOT NULL,
  PRIMARY KEY (`cd_produto`),
  INDEX `fk_tb_produto_tb_funcionario1_idx` (`id_funcionario`),
  CONSTRAINT `fk_tb_produto_tb_funcionario1`
    FOREIGN KEY (`id_funcionario`)
    REFERENCES `bd_gerenciamento_de_estoque`.`tb_funcionario` (`cd_funcionario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `bd_gerenciamento_de_estoque`.`tb_estoque`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bd_gerenciamento_de_estoque`.`tb_estoque` (
  `cd_estoque` INT NOT NULL AUTO_INCREMENT,
  `qt_produto` INT NOT NULL,
  `id_produto` INT NOT NULL,
  PRIMARY KEY (`cd_estoque`),
  INDEX `fk_tb_estoque_tb_produto1_idx` (`id_produto`),
  CONSTRAINT `fk_tb_estoque_tb_produto1`
    FOREIGN KEY (`id_produto`)
    REFERENCES `bd_gerenciamento_de_estoque`.`tb_produto` (`cd_produto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `bd_gerenciamento_de_estoque`.`tb_categoria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bd_gerenciamento_de_estoque`.`tb_categoria` (
  `cd_categoria` INT NOT NULL AUTO_INCREMENT,
  `nm_categoria` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`cd_categoria`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `bd_gerenciamento_de_estoque`.`tb_relatorio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bd_gerenciamento_de_estoque`.`tb_relatorio` (
  `cd_relatorio` INT NOT NULL AUTO_INCREMENT,
  `dt_registro_relatorio` DATETIME NOT NULL,
  `st_relatorio` CHAR(1) NOT NULL,
  `id_produto` INT NOT NULL,
  `id_categoria` INT NOT NULL,
  `id_estoque` INT NOT NULL,
  PRIMARY KEY (`cd_relatorio`),
  UNIQUE INDEX `cd_relatorio_UNIQUE` (`cd_relatorio`),
  INDEX `fk_tb_relatorio_tb_produto1_idx` (`id_produto`),
  INDEX `fk_tb_relatorio_tb_categoria1_idx` (`id_categoria`),
  INDEX `fk_tb_relatorio_tb_estoque1_idx` (`id_estoque`),
  CONSTRAINT `fk_tb_relatorio_tb_produto1`
    FOREIGN KEY (`id_produto`)
    REFERENCES `bd_gerenciamento_de_estoque`.`tb_produto` (`cd_produto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tb_relatorio_tb_categoria1`
    FOREIGN KEY (`id_categoria`)
    REFERENCES `bd_gerenciamento_de_estoque`.`tb_categoria` (`cd_categoria`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tb_relatorio_tb_estoque1`
    FOREIGN KEY (`id_estoque`)
    REFERENCES `bd_gerenciamento_de_estoque`.`tb_estoque` (`cd_estoque`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

select * from tb_funcionario;

select * from tb_tipo_funcionario;

select * from tb_produto;

insert into tb_tipo_funcionario (nm_tipo_funcionario) values ('Administrador');
insert into tb_tipo_funcionario (nm_tipo_funcionario) values ('Usuário');
insert into tb_tipo_funcionario (nm_tipo_funcionario) values ('Convidado');