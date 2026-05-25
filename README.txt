Acceder a base de datos:
    sudo -u postgres psql -d app_dev_db

Crear tabla usuarios:
    CREATE TABLE usuarios (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

Ver todas las tablas:
    \d

Ver contenidos de tabla usuarios:
    SELECT * FROM usuarios;