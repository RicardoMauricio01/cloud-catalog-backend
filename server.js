require('./config/env');

const express = require('express');
const cors = require('cors');

const testRoutes = require('./routes/testRoutes');

const pool = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use('/', testRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('==========================================');
    console.log(`SERVIDOR ARRANCADO`);
    console.log(`Puerto: ${PORT}`);
    console.log(`Entorno: ${process.env.NODE_ENV}`);
    console.log('==========================================');
});

// cierre limpio
process.on('SIGINT', async () => {

    console.log('\nCerrando servidor...');

    await pool.end();

    console.log('Pool PostgreSQL cerrado');

    process.exit(0);
});