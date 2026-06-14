const pool = require("../config/db");

const UserDao = {

    async findAll() {
        const result = await pool.query(
            `SELECT id, username, fecha_registro FROM usuarios ORDER BY id ASC`
        );
        return result.rows;
    },

    async findById(id) {
        const result = await pool.query(
            `SELECT id, username, fecha_registro FROM usuarios WHERE id = $1`,
            [id]
        );
        return result.rows[0] || null;
    },

    async findByUsername(username) {
        const result = await pool.query(
            `SELECT * FROM usuarios WHERE username = $1`,
            [username]
        );
        return result.rows[0] || null;
    },

    async create({ username, password }) {
        const result = await pool.query(
            `INSERT INTO usuarios (username, password) VALUES ($1, $2)
             RETURNING id, username, fecha_registro`,
            [username, password]
        );
        return result.rows[0];
    },

    async update(id, { username, password }) {
        const result = await pool.query(
            `UPDATE usuarios SET username = $1, password = $2 WHERE id = $3
             RETURNING id, username, fecha_registro`,
            [username, password, id]
        );
        return result.rows[0] || null;
    },

    async delete(id) {
        await pool.query(
            `DELETE FROM usuarios WHERE id = $1`,
            [id]
        );
    }
};

module.exports = UserDao;
