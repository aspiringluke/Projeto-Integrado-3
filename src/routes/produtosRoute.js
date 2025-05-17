const express = require('express');
const router = express.Router();
const ProdutoController = require('../controllers/produtosController');
const auth_vendedor = require('../middleware/auth_vendedor_middleware');
const auth_admin = require('../middleware/auth_admin_middleware');

/**
 * |==================================|
 * |========= ROTA /produtos =========|
 * |==================================|
 */

router.get('/', auth_vendedor, ProdutoController.listAll);
router.get('/:id', auth_vendedor, ProdutoController.listOne);
router.post('/', auth_admin, ProdutoController.createProdutos);
router.put('/', auth_admin, ProdutoController.updateProdutos);
router.delete('/', auth_admin, ProdutoController.deleteProduto);

module.exports = router;
