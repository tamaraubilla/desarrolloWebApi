import jwt from 'jsonwebtoken';
import { sql } from '../../config.js';
import { CLAVE_SECRETA } from '../../config.js';
import { AUTH_COOKIE_NAME } from '../../config.js';

export const adminMiddleware = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const query = 'SELECT is_admin FROM users WHERE id = $1';
        const result = await sql(query, [userId]);

        if (result.length > 0 && result[0].is_admin) {
            next();
        } else {
            res.status(403).json({ error: 'Acceso denegado' });
        }
    } catch (error) {
        console.error("Error en adminMiddleware:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export default adminMiddleware;
