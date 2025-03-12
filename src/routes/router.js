// configuração de rotas?
// requerer o express
const express = require('express');
// utilizar o método de rotas do express
const router = express.Router();

const userRoute = require('./userRoute');
const pedidoRoute = require('./pedidoRoute');

// rota url
// rota de listar os usuários
// existem padrões para definir os nomes nas URLs
// para listar os usuários, é 'users'
router.use('/users', userRoute);
router.use('/pedidos', pedidoRoute);

// TODO: Criar as rotas GET dos outros dois arquivos

module.exports = router;