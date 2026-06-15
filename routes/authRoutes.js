// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // Tu conexión a PostgreSQL
const crypto = require("crypto"); // Módulo nativo de Node.js para generar tokens seguros

// Ruta para el Login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Buscamos el usuario en tu tabla (ajusta 'usuarios' o 'username' según tu BD)
        const result = await pool.query("SELECT * FROM usuarios WHERE username = $1", [username]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: "El usuario no existe" });
        }

        const usuario = result.rows[0];

        // Validación simple de contraseña (si usas bcrypt o texto plano, cámbialo aquí)
        if (usuario.password !== password) {
            return res.status(400).json({ error: "Contraseña incorrecta" });
        }

        // Si todo está OK, respondemos lo que el frontend espera
        return res.json({
            user: usuario.username,
            mensaje: "Login exitoso"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Ruta para el Registro
router.post("/register", async (req, res) => {
    // MODIFICADO: Se añade 'email' a la desestructuración de req.body
    const { username, password, email } = req.body; 

    // Validación básica para asegurar que venga el correo electrónico
    if (!email) {
        return res.status(400).json({ error: "El correo electrónico es obligatorio" });
    }

    try {
        // Insertar el nuevo usuario en la base de datos (MODIFICADO: Ahora incluye la columna 'email' y su valor $3)
        await pool.query("INSERT INTO usuarios (username, password, email) VALUES ($1, $2, $3)", [username, password, email]);
        return res.json({ mensaje: "Usuario creado con éxito" });
    } catch (error) {
        console.error(error);
        // Captura el error de clave duplicada en PostgreSQL (por si el correo o usuario ya existen)
        if (error.code === '23505') {
            return res.status(400).json({ error: "El usuario o el correo ya están registrados" });
        }
        return res.status(500).json({ error: "No se pudo registrar el usuario" });
    }
});

// Ruta para Solicitar Recuperación (Generar Token)
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
        // Verificar si el correo electrónico existe en la base de datos
        const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
        
        if (result.rows.length === 0) {
            return res.status(400).json({ error: "No hay ninguna cuenta asociada a este correo electrónico" });
        }

        // Generar un token aleatorio seguro de 32 caracteres hexadecimales
        const token = crypto.randomBytes(16).toString("hex");
        
        // Definir que el token expire en 1 hora a partir del momento actual
        const expires = new Date();
        expires.setHours(expires.getHours() + 1);

        // Guardar el token generado y su fecha de expiración en el registro del usuario correspondiente
        await pool.query(
            "UPDATE usuarios SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3",
            [token, expires, email]
        );

        // Construir la URL temporal que se usará en el frontend para cambiar la contraseña
        const resetUrl = `http://localhost:5173/pages/reset-password.html?token=${token}`;

        // Devolvemos el token y la URL simulada para que puedas realizar pruebas en Postman antes de configurar Nodemailer
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

// Ruta para Reestablecer la Contraseña usando el Token
router.post("/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ error: "El token y la nueva contraseña son requeridos" });
    }

    try {
        // Buscar al usuario que posea el token indicado y validar que el tiempo de expiración sea mayor al actual (NOW())
        const result = await pool.query(
            "SELECT * FROM usuarios WHERE reset_password_token = $1 AND reset_password_expires > NOW()",
            [token]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: "El token de recuperación es inválido o ha expirado" });
        }

        const usuario = result.rows[0];

        // Actualizar la contraseña del usuario con el nuevo valor y limpiar los campos del token para inhabilitar un segundo uso
        await pool.query(
            "UPDATE usuarios SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2",
            [newPassword, usuario.id]
        );

        return res.json({ mensaje: "Tu contraseña ha sido reestablecida con éxito" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al intentar reestablecer la contraseña" });
    }
});

module.exports = router;
