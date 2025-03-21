import express from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  updateUser
} from '../controllers/userController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Registro y login públicos
router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin solo
router.get('/', protect, adminOnly, getAllUsers);
router.put('/:id', protect, adminOnly, updateUser);

export default router;
