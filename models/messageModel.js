// Aqui quedan las consultas de mensajes para no mezclar SQL con otras capas.

const pool = require("./db");

async function getMessagesByRoom(idSala) {
  const resultado = await pool.query(
    `
      SELECT
        m.id,
        m.contenido,
        m.fecha,
        m.id_usuario,
        m.id_sala,
        u.nombre,
        u.email
      FROM mensaje m
      INNER JOIN usuario u ON u.id = m.id_usuario
      WHERE m.id_sala = $1
      ORDER BY m.fecha ASC
    `,
    [idSala]
  );

  return resultado.rows;
}

async function createMessage({ contenido, idUsuario, idSala }) {
  const resultado = await pool.query(
    `
      INSERT INTO mensaje (contenido, id_usuario, id_sala)
      VALUES ($1, $2, $3)
      RETURNING id, contenido, fecha, id_usuario, id_sala
    `,
    [contenido, idUsuario, idSala]
  );

  return resultado.rows[0];
}

module.exports = {
  getMessagesByRoom,
  createMessage,
};
