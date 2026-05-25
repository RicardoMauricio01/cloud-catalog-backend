const dotenv = require('dotenv');

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;

dotenv.config({ path: envFile });

console.log(`Usando configuración: ${envFile}`);

// Validación de variables de entorno requeridas
const requiredEnvVars = [
    'PORT',
    'DB_USER',
    'DB_PASSWORD',
    'DB_HOST',
    'DB_NAME',
    'NODE_ENV'
];

requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        console.error(`Falta la variable de entorno: ${envVar}`);
        process.exit(1);
    }
});

console.log('Variables de entorno cargadas correctamente');

const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcrypt');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta inicial para saber que el servidor vive
app.get('/', (req, res) => {
    res.send('El servidor está funcionando correctamente');
});

// Ruta de prueba de base de datos
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ message: "Conexión exitosa", time: result.rows[0] });
    } catch (err) {
        console.error("Error en la DB:", err);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;

// --- RUTA PARA REGISTRAR (CREATE) ---
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Encriptamos la contraseña (Seguridad)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 2. Insertamos en la base de datos
        const newUser = await pool.query(
            "INSERT INTO usuarios (username, password) VALUES ($1, $2) RETURNING *",
            [username, hashedPassword]
        );

        res.json({ message: "Usuario creado con éxito", user: newUser.rows[0].username });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Error al registrar usuario (tal vez el nombre ya existe)" });
    }
});

// --- RUTA PARA EL LOGIN (READ/VERIFY) ---
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await pool.query("SELECT * FROM usuarios WHERE username = $1", [username]);

        if (user.rows.length === 0) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        // Comparamos la contraseña escrita con la encriptada en la DB
        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        res.json({ message: "¡Bienvenido!", user: user.rows[0].username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- RUTA PARA LEER (READ) ---
app.get('/usuarios', async (req, res) => {
    try {
        const allUsers = await pool.query("SELECT id, username FROM usuarios ORDER BY id ASC");
        res.json(allUsers.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- RUTA PARA ACTUALIZAR (UPDATE) ---
app.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        await pool.query(
            "UPDATE usuarios SET username = $1, password = $2 WHERE id = $3",
            [username, hashedPassword, id]
        );
        res.json({ message: "Usuario actualizado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- RUTA PARA BORRAR (DELETE) ---
app.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
        res.json({ message: "Usuario eliminado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log('==========================================');
    console.log(` SERVIDOR ARRANCADO`);
    console.log(` Puerto: ${PORT}`);
    console.log(` Entorno: ${process.env.NODE_ENV}`);
    console.log('==========================================');
});