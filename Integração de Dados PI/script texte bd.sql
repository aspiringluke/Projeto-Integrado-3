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


