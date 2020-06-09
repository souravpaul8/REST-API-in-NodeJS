/* eslint-disable no-console */
const express = require('express');
const UserController = require('../controllers/users');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();


router.post('/signup', UserController.users_add_new);

router.post('/login', UserController.users_login);

router.delete('/:userId', checkAuth, UserController.users_delete);

module.exports = router;
