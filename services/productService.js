const pool = require("../config/db");

// GET todos
exports.getProducts = async () => {
    const result = await pool.query(`
        SELECT *
        FROM productos
        WHERE activo = true
        ORDER BY id ASC
    `);

    return result.rows;
};

// GET uno
exports.getProductById = async (id) => {
    const result = await pool.query(
        `
        SELECT *
        FROM productos
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0];
};

// POST
exports.createProduct = async (data) => {
    const { nombre, descripcion, precio, stock, imagen_url } = data;

    const result = await pool.query(
        `
        INSERT INTO productos
        (
            nombre,
            descripcion,
            precio,
            stock,
            imagen_url
        )
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *
        `,
        [nombre, descripcion, precio, stock, imagen_url]
    );

    return result.rows[0];
};

// PUT
exports.updateProduct = async (id, data) => {
    const { nombre, descripcion, precio, stock, imagen_url } = data;

    const result = await pool.query(
        `
        UPDATE productos
        SET
            nombre = $1,
            descripcion = $2,
            precio = $3,
            stock = $4,
            imagen_url = $5,
            updated_at = NOW()
        WHERE id = $6
        RETURNING *
        `,
        [nombre, descripcion, precio, stock, imagen_url, id]
    );

    return result.rows[0];
};

// DELETE lógico
exports.deleteProduct = async (id) => {
    await pool.query(
        `
        UPDATE productos
        SET activo = false
        WHERE id = $1
        `,
        [id]
    );
};
