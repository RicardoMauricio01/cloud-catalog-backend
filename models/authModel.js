// Aqui dejo las consultas SQL de usuarios para que sea facil cambiarlas despues.

const pool = require("./db");

async function findUserByEmail(email) {
  const resultado = await pool.query(
    `
      SELECT u.id, u.nombre, u.email, u.contrasena, u.id_rol, r.nombre AS rol
      FROM usuario u
      INNER JOIN rol r ON r.id = u.id_rol
      WHERE u.email = $1
    `,
    [email]
  );

  return resultado.rows[0];
}

async function findUserById(id) {
  const resultado = await pool.query(
    `
      SELECT u.id, u.nombre, u.email, u.id_rol, r.nombre AS rol
      FROM usuario u
      INNER JOIN rol r ON r.id = u.id_rol
      WHERE u.id = $1
    `,
    [id]
  );

  return resultado.rows[0];
}

async function createUser({ nombre, email, passwordHash, idRol }) {
  const resultado = await pool.query(
    `
      INSERT INTO usuario (nombre, email, contrasena, id_rol)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nombre, email, id_rol
    `,
    [nombre, email, passwordHash, idRol]
  );

  return resultado.rows[0];
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
};
