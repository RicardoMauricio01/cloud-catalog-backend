const pool = require("../config/db");

const ProductDao = {

    async findAll() {
        const result = await pool.query(
            `SELECT * FROM productos WHERE activo = true ORDER BY id ASC`
        );
        return result.rows;
    },

    async findById(id) {
        const result = await pool.query(
            `SELECT * FROM productos WHERE id = $1`,
            [id]
        );
        return result.rows[0] || null;
    },

    async create({ nombre, descripcion, precio, stock, imagen_url }) {
        const result = await pool.query(
            `INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [nombre, descripcion, precio, stock, imagen_url]
        );
        return result.rows[0];
    },

    async update(id, { nombre, descripcion, precio, stock, imagen_url }) {
        const result = await pool.query(
            `UPDATE productos
             SET nombre = $1, descripcion = $2, precio = $3,
                 stock = $4, imagen_url = $5, updated_at = NOW()
             WHERE id = $6
             RETURNING *`,
            [nombre, descripcion, precio, stock, imagen_url, id]
        );
        return result.rows[0] || null;
    },

    async deleteSoft(id) {
        await pool.query(
            `UPDATE productos SET activo = false WHERE id = $1`,
            [id]
        );
    }
};

module.exports = ProductDao;
