import { sql } from '../../config.js';


// Obtener el saldo de la billetera
export const getBalance = async (req, res) => {
    const userId = req.user.id;

    try {
        const query = 'SELECT balance FROM wallets WHERE user_id = $1';
        const result = await sql(query, [userId]);

        if (result.length === 0) {
            return res.status(404).json({ error: 'Billetera no encontrada' });
        }

        res.json({ balance: result[0].balance });
    } catch (error) {
        console.error("Error al obtener el saldo:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

