/**
 * |================================|
 * |========= ROTA /users  =========|
 * |================================|
 */

const express = require('express');
const router = express.Router();
const usersController = require("../../controllers/usersController");
const Auth = require('../../middleware/auth_user_middleware');

router.get('/', Auth, usersController.listAll);

module.exports = router;