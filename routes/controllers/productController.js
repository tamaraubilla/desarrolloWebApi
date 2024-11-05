

import { sql } from '../../config.js';

// 1. Función para agregar un producto
export const addProduct = async (req, res) => {
    const { name, description, price, stock } = req.body;
    
    try {
        const query = `
            INSERT INTO products (name, description, price, stock) 
            VALUES ($1, $2, $3, $4) RETURNING id
        `;
        const result = await sql(query, [name, description, price, stock]);

        res.status(201).json({ message: 'Producto agregado con éxito', productId: result[0].id });
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// 2. Función para obtener un producto por su ID
export const getProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        const query = 'SELECT * FROM products WHERE id = $1';
        const result = await sql(query, [productId]);

        if (result.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json({ product: result[0] });
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


// 4. Función para actualizar un producto
export const updateProduct = async (req, res) => {
    const productId = req.params.id;
    const { name, description, price, stock } = req.body;

    try {
        const query = `
            UPDATE products 
            SET name = $1, description = $2, price = $3, stock = $4 
            WHERE id = $5 RETURNING *
        `;
        const result = await sql(query, [name, description, price, stock, productId]);

        if (result.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto actualizado con éxito', product: result[0] });
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// 5. Función para eliminar un producto
export const deleteProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
        const result = await sql(query, [productId]);

        if (result.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto eliminado con éxito' });
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
