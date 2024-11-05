import express from 'express';
import { addProduct, getProduct, updateProduct, deleteProduct } from './controllers/productController.js';

const router = express.Router();

router.post('/products', addProduct);
router.get('/products/:id', getProduct);
router.get('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;
