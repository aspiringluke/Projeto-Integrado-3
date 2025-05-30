const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../../swagger/swagger_output.json');

const auth_admin = require('../middleware/auth_admin_middleware');
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

// rota da documentação do Swagger
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

module.exports = router;