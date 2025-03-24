const express = require('express');
const router = express.Router();

// import de classes
// requerer o método de listar todos
const usersController = require('../controllers/usersController');

router.get('/', usersController.listAll);

router.get('/:id', usersController.listOne);

module.exports = router;