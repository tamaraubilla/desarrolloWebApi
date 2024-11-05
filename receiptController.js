import { sql } from '../../config.js';


export const createReceipt = async (req, res) => {
    const { userId, items, totalAmount } = req.body;

    
    if (!userId || !items || totalAmount === undefined) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    try {
        const query = 'INSERT INTO receipts (user_id, items, total_amount) VALUES ($1, $2, $3) RETURNING id';
        const result = await sql(query, [userId, JSON.stringify(items), totalAmount]);
        const receiptId = result[0].id;

        res.status(201).json({ message: 'Recibo creado exitosamente', receiptId });
    } catch (error) {
        console.error("Error al crear el recibo:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


export const getReceipts = async (req, res) => {
    const userId = req.user.id;

    try {
        const query = 'SELECT * FROM receipts WHERE user_id = $1';
        const results = await sql(query, [userId]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'No se encontraron recibos' });
        }

        res.json({ receipts: results });
    } catch (error) {
        console.error("Error al obtener los recibos:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


