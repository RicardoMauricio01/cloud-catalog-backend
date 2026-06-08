// Este middleware cifra la contraseña del usuario antes de guardarla.

const bcrypt = require("bcryptjs");

async function hashUserPassword(req, res, next) {
  try {
    if (req.body.password) {
      req.body.passwordHash = await bcrypt.hash(req.body.password, 10);
    }

    next();
  } catch (error) {
    console.error("Error al cifrar la contraseña:", error);
    return res.status(500).json({ mensaje: "Error al procesar la contraseña" });
  }
}

async function hashSimplePassword(texto) {
  return bcrypt.hash(texto, 10);
}

async function comparePassword(textoPlano, textoCifrado) {
  return bcrypt.compare(textoPlano, textoCifrado);
}

module.exports = {
  hashUserPassword,
  hashSimplePassword,
  comparePassword,
};
