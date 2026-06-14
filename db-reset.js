require("./config/env");

const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432
});

async function resetDatabase() {
    const client = await pool.connect();

    try {
        console.log("Iniciando reinicio de base de datos...\n");

        await client.query("BEGIN");

        // Vaciar tablas en orden (categorias primero por FK)
        console.log("> Vaciando tablas...");
        await client.query("TRUNCATE TABLE categorias RESTART IDENTITY CASCADE");
        await client.query("TRUNCATE TABLE productos RESTART IDENTITY CASCADE");
        await client.query("TRUNCATE TABLE usuarios RESTART IDENTITY CASCADE");
        console.log("  ✓ Tablas vaciadas\n");

        // Insertar datos de prueba - usuarios
        console.log("> Insertando usuarios...");
        await client.query(
            `INSERT INTO usuarios (username, password)
             VALUES ('admin', '$2b$10$HASH')`
        );
        console.log("  ✓ 1 usuario insertado\n");

        // Insertar datos de prueba - productos
        console.log("> Insertando productos...");
        const products = [
            ['Teclado Mecánico RGB', 'Teclado gamer con switches blue y luces RGB.', 45990, 12],
            ['Mouse Gamer Pro', 'Mouse ergonómico de 12000 DPI.', 24990, 20],
            ['Audífonos Bluetooth', 'Audífonos inalámbricos con cancelación de ruido.', 39990, 8],
            ['Monitor 24 pulgadas', 'Monitor Full HD de 75Hz.', 129990, 6],
            ['Webcam HD', 'Webcam 1080p ideal para videollamadas.', 18990, 15],
            ['SSD 1TB', 'Unidad de estado sólido NVMe de alta velocidad.', 79990, 10],
            ['Notebook Stand', 'Base metálica ajustable para notebook.', 15990, 18],
            ['Micrófono USB', 'Micrófono condensador para streaming.', 34990, 7],
            ['Hub USB-C', 'Adaptador multipuerto USB-C.', 22990, 11],
            ['Parlante Bluetooth', 'Parlante portátil resistente al agua.', 27990, 9]
        ];

        for (const [nombre, descripcion, precio, stock] of products) {
            await client.query(
                `INSERT INTO productos (nombre, descripcion, precio, stock, activo)
                 VALUES ($1, $2, $3, $4, true)`,
                [nombre, descripcion, precio, stock]
            );
        }
        console.log(`  ✓ ${products.length} productos insertados\n`);

        // Insertar datos de prueba - categorias
        console.log("> Insertando categorías...");
        const categorias = ['Electrónica', 'Computación', 'Audio', 'Accesorios'];
        for (const nombre of categorias) {
            await client.query(
                `INSERT INTO categorias (nombre) VALUES ($1)`,
                [nombre]
            );
        }
        console.log(`  ✓ ${categorias.length} categorías insertadas\n`);

        await client.query("COMMIT");

        console.log("========================================");
        console.log("Base de datos reiniciada exitosamente");
        console.log("========================================");
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Error durante el reinicio:", err.message);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

resetDatabase();
