const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');

router.get('/', usersController.listAll);
router.get('/:id', usersController.listOne);

router.post('/create', usersController.createUser)
/**
 * "The difference between the POST and PUT APIs can be observed
 * in request URIs. POST requests are made on resource collections,
 * whereas PUT requests are made on a single resource."
 */
router.put('/', usersController.updateUser);
// ^ router.put('/:id', usersController.updateUser); ?

router.delete('/', usersController.deleteUser);

module.exports = router;