import jwt from 'jsonwebtoken';
import { CLAVE_SECRETA, AUTH_COOKIE_NAME } from '../../config.js';

export const authMiddleware = (req, res, next) => {
    const token = req.cookies[AUTH_COOKIE_NAME];
    
    try {
        req.user = jwt.verify(token, CLAVE_SECRETA);
        next();
    } catch (error) {
        res.status(401).json({ error: 'No autorizado' });
    }
};

export default authMiddleware;