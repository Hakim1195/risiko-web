// Routes d'authentification
const express = require('express');
const router = express.Router();

// Controllers
const { AuthController } = require('../controllers/auth.controller');

// Routes d'authentification
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/logout', AuthController.logout);
router.get('/profile', AuthController.getProfile);
router.put('/profile', AuthController.updateProfile);

module.exports = router;