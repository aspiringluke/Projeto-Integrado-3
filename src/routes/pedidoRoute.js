const express = require('express');
const router = express.Router();

const PedidoController = require('../controllers/pedidosController');

/**
 * |=================================|
 * |========= ROTA /pedidos =========|
 * |=================================|
 */

router.get('/', PedidoController.listAll);

router.get('/:id', PedidoController.listOne);

router.post('/', PedidoController.create);

module.exports = router;