const express = require('express');
const router = express.Router();

const usersRoute = require('./users/usersRoute');
const userRoute = require('./users/userRoute');
const pedidoRoute = require('./pedidoRoute');
const produtoRoute = require('./produtoRoute');
const loginRoute = require('./users/loginRoute');

// redirecionamento de rotas
router.use('/users', usersRoute);
router.use('/user', userRoute);
router.use('/pedidos', pedidoRoute);
router.use('/produtos', produtoRoute);
router.use('/login', loginRoute);

module.exports = router;