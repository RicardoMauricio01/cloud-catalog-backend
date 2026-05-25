const { Pool } = require('pg');

// Validación básica de variables requeridas
const requiredEnvVars = [
    'DB_USER',
    'DB_PASSWORD',
    'DB_HOST',
    'DB_NAME',
    'NODE_ENV'
];

requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        throw new Error(`Falta la variable ${envVar}`);
    }
});

// Configuración del pool
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,

    // Opcional
    max: 20, // máximo conexiones
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

// Verificación de conexión
pool.connect()
    .then(client => {
        console.log('==========================================');
        console.log('PostgreSQL conectado');
        console.log(`Base de datos: ${process.env.DB_NAME}`);
        console.log('==========================================');

        client.release();
    })
    .catch(err => {
        console.error('Error de conexión PostgreSQL');
        console.error(err.message);

        process.exit(1);
    });

// Manejo de errores inesperados del pool
pool.on('error', (err) => {
    console.error('Error inesperado PostgreSQL:', err.message);
});

module.exports = pool;