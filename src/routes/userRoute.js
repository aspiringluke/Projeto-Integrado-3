const express = require('express');
const router = express.Router();

// import de classes
// requerer o método de listar todos
const ListAllUser = require('../controllers/users/list_all_users');

router.get('/', ListAllUser.listAll);

module.exports = router;