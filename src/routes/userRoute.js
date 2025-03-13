const express = require('express');
const router = express.Router();

// import de classes
// requerer o método de listar todos
const usersController = require('../controllers/usersController');

router.get('/', usersController.listAll);

module.exports = router;