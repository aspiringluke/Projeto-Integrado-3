const express = require('express');
const router = express.Router();

const ProdutoController = require('../controllers/produtosController');

/**
 * |==================================|
 * |========= ROTA /produtos =========|
 * |==================================|
 */

router.get('/', ProdutoController.listAll);

router.get('/:id', ProdutoController.listOne);

module.exports = router;
