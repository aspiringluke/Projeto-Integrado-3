const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');
const auth_vendedor = require('../middleware/auth_vendedor_middleware');
const auth_admin = require('../middleware/auth_admin_middleware');

router.get('/', clientesController.listAll);
router.get('/:id', clientesController.listOne);

module.exports = router;