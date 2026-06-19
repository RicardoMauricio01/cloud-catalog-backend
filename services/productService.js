const pool = require("../config/db");

// GET todos
exports.getProducts = async () => {
    const result = await pool.query(`
        SELECT *
        FROM productos
        WHERE activo = true
        ORDER BY id ASC
    `);

    return result.rows.map((product) => ({
        ...product,
        precio: Number(product.precio),
    }));
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

    if (result.rows.length === 0) {
        return null;
    }

    return {
        ...result.rows[0],
        precio: Number(result.rows[0].precio),
    };
};

// POST
exports.createProduct = async (data) => {
    const { nombre, descripcion, precio, stock, imagen_url, categoria_id } = data;
    const result = await pool.query(
        `
        INSERT INTO productos (
            nombre,
            descripcion,
            precio,
            stock,
            imagen_url,
            categoria_id
        )
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING *
        `,
        [nombre, descripcion, precio, stock, imagen_url, categoria_id]);

    return {
        ...result.rows[0],
        precio: Number(result.rows[0].precio),
    };
};

// PUT
exports.updateProduct = async (id, data) => {
    const { nombre, descripcion, precio, stock, imagen_url, categoria_id } = data;
    
    if (imagen_url) {
        data.imagen_url = imagen_url;
    }

    const result = await pool.query(
        `
        UPDATE productos
        SET
            nombre = $1,
            descripcion = $2,
            precio = $3,
            stock = $4,
            imagen_url = COALESCE(NULLIF($5, ''), imagen_url),
            categoria_id = $6,
            updated_at = NOW()
        WHERE id = $7
        RETURNING *
        `,
        [nombre, descripcion, precio, stock, imagen_url, categoria_id, id]
    );

    if (result.rows.length === 0) {
        return null;
    }

    return {
        ...result.rows[0],
        precio: Number(result.rows[0].precio),
    };
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
