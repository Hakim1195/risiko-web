// Routes d'authentification
const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controllers/auth.controller');

// Routes d'authentification
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.get('/profile', authController.getProfile);
router.put('/profile', authController.updateProfile);

module.exports = router;