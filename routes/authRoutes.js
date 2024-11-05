import express from 'express';
import authMiddleware from './middlewares/authmiddleware.js';
import  adminMiddleware  from './middlewares/adminMiddleware.js';
import { login, signup, admin_login, logout, getProfile } from './controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/admin_login', admin_login);
router.post('/logout', logout);
router.get('/profile', authMiddleware, getProfile);

export default router;
