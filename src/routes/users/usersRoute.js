const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const get_user = require('../../middleware/get_user_middleware');
const auth_admin = require('../../middleware/auth_admin_middleware');

/**
 * |===============================|
 * |========= ROTA /users =========|
 * |===============================|
 */

router.get('/', auth_admin, usersController.listAll);
router.get('/:id', get_user, usersController.listOne);
router.post('/', auth_admin, usersController.createUser);
router.put('/:id', auth_admin, usersController.updateUser);
router.delete('/:id', auth_admin, usersController.deleteUser);

/**
 * "The difference between the POST and PUT APIs can be observed
 * in request URIs. POST requests are made on resource collections,
 * whereas PUT requests are made on a single resource."
 */
module.exports = router;