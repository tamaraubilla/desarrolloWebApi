import express from 'express';
import { getCart, addToCart, removeFromCart, updateCartItem } from './controllers/cartController.js';

const router = express.Router();

router.get('/', getCart);         // GET /api/cart
router.post('/', addToCart);       // POST /api/cart
router.delete('/', removeFromCart); // DELETE /api/cart
router.put('/', updateCartItem);   // PUT /api/cart

export default router;
