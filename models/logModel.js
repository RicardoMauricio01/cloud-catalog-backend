// Esta tabla guarda acciones simples para demostrar historial de actividad.

const pool = require("./db");

async function createLog({ idUsuario, accion, descripcion }) {
  await pool.query(
    `
      INSERT INTO log_actividad (id_usuario, accion, descripcion)
      VALUES ($1, $2, $3)
    `,
    [idUsuario || null, accion, descripcion]
  );
}

module.exports = {
  createLog,
};
