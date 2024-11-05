import express from 'express';
import { getBalance } from './controllers/walletController.js';
import authMiddleware from './middlewares/authmiddleware.js';

const router = express.Router();


router.get('/wallet/balance', authMiddleware, getBalance); // Obtener saldo


export default router;
