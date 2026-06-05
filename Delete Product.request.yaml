const pool = require('../config/db');

const home = (req, res) => {
    res.send('El servidor está funcionando correctamente');
};

const testDb = async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');

        res.json({
            message: 'Conexión exitosa',
            time: result.rows[0]
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
};

module.exports = {
    home,
    testDb
};