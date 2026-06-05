// backend/config/db.js

const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,

    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

pool.connect()
    .then(client => {

        console.log('==========================================');
        console.log('PostgreSQL conectado');
        console.log(`Base de datos: ${process.env.DB_NAME}`);
        console.log('==========================================');

        client.release();

    })
    .catch(err => {

        console.error('Error PostgreSQL');

        console.error(err.message);

        process.exit(1);

    });

pool.on('error', (err) => {

    console.error(
        'Error inesperado PostgreSQL:',
        err.message
    );

});

module.exports = pool;