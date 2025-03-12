const express = require('express');
const router = express.Router();

const ProdutoController = require('../controllers/produtos/produtosController');

router.get('/', ProdutoController.getProduto);

module.exports = router;
