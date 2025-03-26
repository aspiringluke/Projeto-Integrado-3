USE teste_banco_api;

INSERT INTO funcao (descricao)
VALUES ('admin'), ('vendedor');

INSERT INTO usuarios (nome, email, senha, funcao_idfuncao)
VALUES
('a', 'a@test.com', '1', 1),
('b', 'b@test.com', '2', 2);
