// Esta capa guarda todas las consultas SQL relacionadas con las salas.

const pool = require("./db");

async function getVisibleRoomsByUser(idUsuario) {
  const resultado = await pool.query(
    `
      SELECT
        s.id,
        s.nombre,
        s.tipo,
        CASE
          WHEN us.id_usuario IS NULL THEN false
          ELSE true
        END AS es_miembro
      FROM sala s
      LEFT JOIN usuario_sala us
        ON s.id = us.id_sala
        AND us.id_usuario = $1
      WHERE s.tipo = 'publica' OR us.id_usuario IS NOT NULL
      ORDER BY s.nombre ASC
    `,
    [idUsuario]
  );

  return resultado.rows;
}

async function findRoomByName(nombre) {
  const resultado = await pool.query(
    "SELECT id, nombre, tipo, contrasena FROM sala WHERE LOWER(nombre) = LOWER($1)",
    [nombre]
  );

  return resultado.rows[0];
}

async function findRoomById(idSala) {
  const resultado = await pool.query(
    "SELECT id, nombre, tipo, contrasena FROM sala WHERE id = $1",
    [idSala]
  );

  return resultado.rows[0];
}

async function createRoom({ nombre, tipo, passwordHash, creadaPor }) {
  const resultado = await pool.query(
    `
      INSERT INTO sala (nombre, tipo, contrasena, creada_por)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nombre, tipo
    `,
    [nombre, tipo, passwordHash, creadaPor]
  );

  return resultado.rows[0];
}

async function addUserToRoom(idUsuario, idSala) {
  await pool.query(
    `
      INSERT INTO usuario_sala (id_usuario, id_sala)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `,
    [idUsuario, idSala]
  );
}

async function userHasAccessToRoom(idUsuario, idSala) {
  const resultado = await pool.query(
    `
      SELECT s.id
      FROM sala s
      LEFT JOIN usuario_sala us
        ON s.id = us.id_sala
        AND us.id_usuario = $2
      WHERE s.id = $1
        AND (s.tipo = 'publica' OR us.id_usuario IS NOT NULL)
    `,
    [idSala, idUsuario]
  );

  return resultado.rows.length > 0;
}

module.exports = {
  getVisibleRoomsByUser,
  findRoomByName,
  findRoomById,
  createRoom,
  addUserToRoom,
  userHasAccessToRoom,
};
