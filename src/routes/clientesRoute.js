const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');
const auth_vendedor = require('../middleware/auth_vendedor_middleware');
const auth_admin = require('../middleware/auth_admin_middleware');

router.get('/', auth_vendedor, clientesController.listAll);
router.get('/:id', auth_vendedor, clientesController.listOne);
router.post('/', auth_vendedor, clientesController.createCliente);

module.exports = router;