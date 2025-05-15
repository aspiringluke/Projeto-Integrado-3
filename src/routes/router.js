const express = require('express');
const router = express.Router();

const usersRoute = require('./users/usersRoute');
const pedidoRoute = require('./pedidosRoute');
const produtoRoute = require('./produtosRoute');
const loginRoute = require('./users/loginRoute');
const clienteRoute = require('./clientesRoute');

// redirecionamento de rotas
router.use('/users', usersRoute);
router.use('/pedidos', pedidoRoute);
router.use('/produtos', produtoRoute);
router.use('/login', loginRoute);
router.use('/clientes', clienteRoute);

module.exports = router;