// Routes de gestion des utilisateurs
import express from 'express';
const router = express.Router();

// Controllers
import userController from '../controllers/user.controller';

// Routes d'utilisateurs
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;