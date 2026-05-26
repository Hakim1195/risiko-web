// Routes de gestion des utilisateurs
const express = require('express');
const router = express.Router();

// Controllers
const userController = require('../controllers/user.controller');

// Routes d'utilisateurs
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
