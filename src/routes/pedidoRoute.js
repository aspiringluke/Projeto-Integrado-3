const express = require('express');
const router = express.Router();

const PedidoController = require('../controllers/pedidosController');

router.get('/', PedidoController.listAll);

module.exports = router;