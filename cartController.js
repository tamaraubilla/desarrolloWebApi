
import { sql } from '../../config.js';  
import { neon } from '@neondatabase/serverless'
import { AUTH_COOKIE_NAME } from '../../config.js';
import jwt from 'jsonwebtoken';

// obtiene el carrito de un usuario
export const getCart = async (req, res) => {
    try {
        const token = req.cookies[AUTH_COOKIE_NAME];
        if (!token) return res.status(401).json({ error: 'Usuario no autenticado' });

        // Imprime la clave secreta para depurar
        console.log('CLAVE_SECRETA:', process.env.CLAVE_SECRETA);

        const decoded = jwt.verify(token, process.env.CLAVE_SECRETA); // Verifica que process.env.CLAVE_SECRETA tenga valor
        const userId = decoded.id;

        const query = 'SELECT * FROM cart WHERE user_id = $1';
        const results = await sql(query, [userId]);

        res.status(200).json({ cartItems: results });
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// agrega un producto al carrito
export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const token = req.cookies[AUTH_COOKIE_NAME];
        if (!token) return res.status(401).json({ error: 'Usuario no autenticado' });

        const decoded = jwt.verify(token, process.env.CLAVE_SECRETA);
        const userId = decoded.id;

        
        let query = 'SELECT id, quantity FROM cart WHERE user_id = $1 AND product_id = $2';
        let results = await sql(query, [userId, productId]);

        if (results.length > 0) {
           
            const newQuantity = results[0].quantity + quantity;
            query = 'UPDATE cart SET quantity = $1 WHERE id = $2';
            await sql(query, [newQuantity, results[0].id]);
        } else {
           
            query = 'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)';
            await sql(query, [userId, productId, quantity]);
        }

        res.status(200).json({ message: 'Producto agregado al carrito' });
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

//  eliminar un producto del carrito
export const removeFromCart = async (req, res) => {
    const { productId } = req.body;

    try {
        const token = req.cookies[AUTH_COOKIE_NAME];
        if (!token) return res.status(401).json({ error: 'Usuario no autenticado' });

        const decoded = jwt.verify(token, process.env.CLAVE_SECRETA);
        const userId = decoded.id;

        const query = 'DELETE FROM cart WHERE user_id = $1 AND product_id = $2';
        await sql(query, [userId, productId]);

        res.status(200).json({ message: 'Producto eliminado del carrito' });
    } catch (error) {
        console.error("Error al eliminar producto del carrito:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

//Calcula la cantidad del carrito de un usuario
export const updateCartItem = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const token = req.cookies[AUTH_COOKIE_NAME];
        if (!token) return res.status(401).json({ error: 'Usuario no autenticado' });

        const decoded = jwt.verify(token, process.env.CLAVE_SECRETA);
        const userId = decoded.id;

        const query = 'UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3';
        await sql(query, [quantity, userId, productId]);

        res.status(200).json({ message: 'Cantidad actualizada en el carrito' });
    } catch (error) {
        console.error("Error al actualizar producto en el carrito:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
