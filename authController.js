import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sql } from '../../config.js';
import { CLAVE_SECRETA, AUTH_COOKIE_NAME } from '../../config.js';


//registro de usuario
export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    const emailCheckQuery = 'SELECT id FROM users WHERE email = $1';
    const emailCheckResult = await sql(emailCheckQuery, [email]);

    if (emailCheckResult.length > 0) {
        return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    const hash = bcrypt.hashSync(password, 5);
    const initialBalance = 10000;
    const query = 'INSERT INTO users (name, email, password, balance) VALUES ($1, $2, $3, $4) RETURNING id';
    const results = await sql(query, [name, email, hash, initialBalance]);
    const userId = results[0].id;

    const token = jwt.sign({ id: userId }, CLAVE_SECRETA, { expiresIn: '5m' });
    res.cookie(AUTH_COOKIE_NAME, token, { maxAge: 5 * 60 * 1000 });
    res.status(201).json({ message: 'Usuario registrado con éxito', userId });
};

//login de usuario
export const login = async (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT id, password FROM users WHERE email = $1';
    const results = await sql(query, [email]);

    if (results.length === 0 || !bcrypt.compareSync(password, results[0].password)) {
        return res.status(400).json({ error: 'Correo o contraseña incorrectos' });
    }

    const token = jwt.sign({ id: results[0].id }, CLAVE_SECRETA, { expiresIn: '5m' });
    res.cookie(AUTH_COOKIE_NAME, token, { maxAge: 5 * 60 * 1000 });
    res.status(200).json({ message: 'Inicio de sesión exitoso' });
};

//login de administrador
export const admin_login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const query = 'SELECT id, password, is_admin FROM users WHERE email = $1';
        const results = await sql(query, [email]);

        if (results.length === 0) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const { id, password: hash, is_admin } = results[0];

        if (!is_admin) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        if (bcrypt.compareSync(password, hash)) {
            const token = jwt.sign({ id, is_admin }, CLAVE_SECRETA, {
                expiresIn: '5m',
            });
            res.cookie(AUTH_COOKIE_NAME, token, { maxAge: 60 * 5 * 1000 });
            return res.status(200).json({ message: 'Inicio de sesión exitoso' });
        }

        res.status(401).json({ error: 'Credenciales incorrectas' });
    } catch (error) {
        console.error("Error en admin_login:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

//cerrar sesión
export const logout = (req, res) => {
    res.clearCookie(AUTH_COOKIE_NAME);
    res.status(200).json({ message: 'Sesión cerrada exitosamente' });
};

//perfil
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id; 
        const query = 'SELECT name, email, balance FROM users WHERE id = $1';
        const result = await sql(query, [userId]);

        if (result.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ user: result[0] });
    } catch (error) {
        console.error("Error al obtener el perfil del usuario:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
