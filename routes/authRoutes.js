const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query("SELECT * FROM usuarios WHERE username = $1", [username]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: "El usuario no existe" });
        }

        const usuario = result.rows[0];

        const match = await bcrypt.compare(password, usuario.password);
        if (!match) {
            return res.status(400).json({ error: "Contraseña incorrecta" });
        }

        return res.json({
            user: usuario.username,
            mensaje: "Login exitoso"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.post("/register", async (req, res) => {
    const { username, password, email } = req.body; 

    if (!email) {
        return res.status(400).json({ error: "El correo electrónico es obligatorio" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            "INSERT INTO usuarios (username, password, email) VALUES ($1, $2, $3)", 
            [username, hashedPassword, email]
        );
        return res.json({ mensaje: "Usuario creado con éxito" });
    } catch (error) {
        console.error(error);
        if (error.code === '23505') {
            return res.status(400).json({ error: "El usuario o el correo ya están registrados" });
        }
        return res.status(500).json({ error: "No se pudo registrar el usuario" });
    }
});

router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
        const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
        
        if (result.rows.length === 0) {
            return res.status(400).json({ error: "No hay ninguna cuenta asociada a este correo electrónico" });
        }

        const token = crypto.randomBytes(16).toString("hex");
        const expires = new Date();
        expires.setHours(expires.getHours() + 1);

        await pool.query(
            "UPDATE usuarios SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3",
            [token, expires, email]
        );

        const resetUrl = `http://192.168.50.23:3000/reset-password.html?token=${token}`;

        return res.json({
            mensaje: "Token de recuperación generado con éxito.",
            token: token,
            url_simulada: resetUrl
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al procesar la solicitud de recuperación" });
    }
});

router.post("/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ error: "El token y la nueva contraseña son requeridos" });
    }

    try {
        const result = await pool.query(
            "SELECT * FROM usuarios WHERE reset_password_token = $1 AND reset_password_expires > NOW()",
            [token]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: "El token de recuperación es inválido o ha expirado" });
        }

        const usuario = result.rows[0];
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.query(
            "UPDATE usuarios SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2",
            [hashedPassword, usuario.id]
        );

        return res.json({ mensaje: "Tu contraseña ha sido reestablecida con éxito" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al intentar reestablecer la contraseña" });
    }
});

module.exports = router;
