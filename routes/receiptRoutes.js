import express from 'express';
import { createReceipt, getReceipts } from './controllers/receiptController.js';
import authMiddleware from './middlewares/authmiddleware.js';

const router = express.Router();

router.post('/receipts', authMiddleware, createReceipt); // Crear recibo
router.get('/receipts', authMiddleware, getReceipts); // Obtener recibos


export default router;
