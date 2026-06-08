// Esta capa procesa los datos y usa los modelos cuando un usuario se registra o entra.

const authModel = require("../models/authModel");
const roleModel = require("../models/roleModel");
const logModel = require("../models/logModel");
const { comparePassword } = require("../middlewares/passwordMiddleware");

async function register(req, res) {
  const { nombre, email, passwordHash } = req.body;

  if (!nombre || !email || !req.body.password) {
    return res.status(400).json({ mensaje: "Faltan datos del registro" });
  }

  try {
    const usuarioExistente = await authModel.findUserByEmail(email);

    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "El correo ya esta registrado" });
    }

    const rolEmpleado = await roleModel.getRoleByName("Empleado");

    if (!rolEmpleado) {
      return res.status(500).json({ mensaje: "No se encontro el rol base del sistema" });
    }

    const nuevoUsuario = await authModel.createUser({
      nombre,
      email,
      passwordHash,
      idRol: rolEmpleado.id,
    });

    await logModel.createLog({
      idUsuario: nuevoUsuario.id,
      accion: "REGISTRO",
      descripcion: `El usuario ${nuevoUsuario.email} se registro en el sistema`,
    });

    return res.status(201).json({
      mensaje: "Usuario creado correctamente",
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
      },
    });
  } catch (error) {
    console.error("Error en registro:", error);
    return res.status(500).json({ mensaje: "Error al registrar usuario" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ mensaje: "Faltan datos del login" });
  }

  try {
    const usuario = await authModel.findUserByEmail(email);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const passwordValida = await comparePassword(password, usuario.contrasena);

    if (!passwordValida) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    await logModel.createLog({
      idUsuario: usuario.id,
      accion: "LOGIN",
      descripcion: `El usuario ${usuario.email} inicio sesion`,
    });

    return res.json({
      mensaje: "Login correcto",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ mensaje: "Error al iniciar sesion" });
  }
}

module.exports = {
  register,
  login,
};
