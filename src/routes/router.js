// configuração de rotas?
// requerer o express
const express = require('express');
// utilizar o método de rotas do express
const router = express.Router();

// requerer o método de listar todos
const ListAllUser = require('../controllers/users/list_all_users');

// rota url
// rota de listar os usuários
// existem padrões para definir os nomes nas URLs
// para listar os usuários, é 'users'
router.get('/users', ListAllUser.listAll);

module.exports = router;