import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'; // Agrega esto
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import productRoutes from './routes/productRoutes.js';
import receiptRoutes from './routes/receiptRoutes.js';
import walletRoutes from './routes/walletRoutes.js';


dotenv.config({ path: './clave.env' }); 
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/products', productRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/wallet', walletRoutes);

// Servidor
app.listen(3001, () => console.log('Servidor escuchando en el puerto 3001'));
