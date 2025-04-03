const express = require('express');
const router = express.Router();

const userRoute = require('./userRoute');
const pedidoRoute = require('./pedidoRoute');
const produtoRoute = require('./produtoRoute');

// redirecionamento de rotas
router.use('/users', userRoute);
router.use('/pedidos', pedidoRoute);
router.use('/produtos', produtoRoute);

module.exports = router;