import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js'
const router = express.Router();

// Rutas
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user', authenticateToken, getUserProfile);



export default router;