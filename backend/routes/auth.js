import express from 'express';
import { 
  register, 
  login, 
  logout, 
  getCurrentUser 
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const authRouter = express.Router();

// Public routes
authRouter.post('/register', register);
authRouter.post('/login', login);

// Protected routes
authRouter.post('/logout', authMiddleware, logout);
authRouter.get('/me', authMiddleware, getCurrentUser);

export default authRouter;
