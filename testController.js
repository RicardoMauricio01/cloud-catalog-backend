// backend/config/env.js

const dotenv = require('dotenv');

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;

dotenv.config({
    path: envFile
});

console.log(`Usando configuración: ${envFile}`);

// Validación global de variables requeridas
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
        throw new Error(
            `Falta la variable de entorno: ${envVar}`
        );
    }
});

console.log('Variables de entorno cargadas correctamente');