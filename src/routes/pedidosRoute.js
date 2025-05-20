const express = require('express');
const router = express.Router();
const PedidoController = require('../controllers/pedidosController');
const auth_vendedor = require('../middleware/auth_vendedor_middleware');
const auth_admin = require('../middleware/auth_admin_middleware');
const pedidosController = require('../controllers/pedidosController');

/**
 * |=================================|
 * |========= ROTA /pedidos =========|
 * |=================================|
 */

router.get('/detalhados', auth_vendedor, PedidoController.listPedidosDetalhados);
router.get('/', auth_vendedor, PedidoController.listAll);
router.put('/:id/status', auth_vendedor, PedidoController.updateStatus);
router.get('/:id', auth_vendedor, PedidoController.listOne);
router.post('/', auth_vendedor, PedidoController.create);
module.exports = router;