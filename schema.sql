-- Base de datos del Taller 01: Chat Corporativo
-- Dejo el SQL simple para que sea facil de explicar en la presentacion.

DROP TABLE IF EXISTS log_actividad;
DROP TABLE IF EXISTS usuario_sala;
DROP TABLE IF EXISTS mensaje;
DROP TABLE IF EXISTS sala;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS rol;

-- Tabla de roles
CREATE TABLE rol (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla de usuarios
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    id_rol INTEGER NOT NULL,
    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (id_rol)
        REFERENCES rol(id)
);

-- Tabla de salas
CREATE TABLE sala (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('publica', 'privada')),
    contrasena VARCHAR(255),
    creada_por INTEGER,
    CONSTRAINT fk_sala_usuario
        FOREIGN KEY (creada_por)
        REFERENCES usuario(id)
        ON DELETE SET NULL
);

-- Tabla de mensajes
CREATE TABLE mensaje (
    id SERIAL PRIMARY KEY,
    contenido TEXT NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario INTEGER NOT NULL,
    id_sala INTEGER NOT NULL,
    CONSTRAINT fk_mensaje_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_mensaje_sala
        FOREIGN KEY (id_sala)
        REFERENCES sala(id)
        ON DELETE CASCADE
);

-- Tabla intermedia entre usuarios y salas
CREATE TABLE usuario_sala (
    id_usuario INTEGER NOT NULL,
    id_sala INTEGER NOT NULL,
    fecha_union TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario, id_sala),
    CONSTRAINT fk_usuario_sala_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_usuario_sala_sala
        FOREIGN KEY (id_sala)
        REFERENCES sala(id)
        ON DELETE CASCADE
);

-- Tabla para registrar acciones del sistema
CREATE TABLE log_actividad (
    id SERIAL PRIMARY KEY,
    accion VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario INTEGER,
    CONSTRAINT fk_log_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id)
        ON DELETE SET NULL
);

-- Datos iniciales para que el sistema parta con valores utiles.
INSERT INTO rol (nombre) VALUES
    ('Administrador'),
    ('Empleado');

INSERT INTO sala (nombre, tipo, contrasena, creada_por)
VALUES ('General', 'publica', NULL, NULL);
