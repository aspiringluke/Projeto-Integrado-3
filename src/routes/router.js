// configuração de rotas?
// requerer o express
const express = require('express');
// utilizar o método de rotas do express
const router = express.Router();

const userRoute = require('./userRoute');
const pedidoRoute = require('./pedidoRoute');
const produtoRoute = require('./produtoRoute');

// rota url
// rota de listar os usuários
// existem padrões para definir os nomes nas URLs
// para listar os usuários, é 'users'
router.use('/users', userRoute);
router.use('/pedidos', pedidoRoute);
router.use('/produtos', produtoRoute);

//rota para listar apenas 1 usuario , produto ou pedido.
router.use('/:id', pedidoRoute);
router.use('/:id', userRoute);
router.use('/:id', produtoRoute);

// TODO: Criar as rotas GET dos outros dois arquivos

module.exports = router;