// Aqui van consultas simples relacionadas con los roles.

const pool = require("./db");

async function getRoleByName(nombre) {
  const resultado = await pool.query(
    "SELECT id, nombre FROM rol WHERE LOWER(nombre) = LOWER($1)",
    [nombre]
  );

  return resultado.rows[0];
}

module.exports = {
  getRoleByName,
};
