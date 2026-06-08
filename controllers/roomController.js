// Esta capa maneja la logica para listar, crear y unirse a salas.

const roomModel = require("../models/roomModel");
const logModel = require("../models/logModel");
const { hashSimplePassword, comparePassword } = require("../middlewares/passwordMiddleware");

async function getRooms(req, res) {
  const idUsuario = Number(req.query.usuarioId);

  if (!idUsuario) {
    return res.status(400).json({ mensaje: "Se necesita usuarioId" });
  }

  try {
    const salas = await roomModel.getVisibleRoomsByUser(idUsuario);
    return res.json(salas);
  } catch (error) {
    console.error("Error al obtener salas:", error);
    return res.status(500).json({ mensaje: "Error al obtener salas" });
  }
}

async function createRoom(req, res) {
  const { nombre, tipo, idUsuario, password } = req.body;

  if (!nombre || !tipo || !idUsuario) {
    return res.status(400).json({ mensaje: "Faltan datos para crear la sala" });
  }

  if (tipo !== "publica" && tipo !== "privada") {
    return res.status(400).json({ mensaje: "El tipo de sala no es valido" });
  }

  if (tipo === "privada" && !password) {
    return res.status(400).json({ mensaje: "La sala privada necesita contraseña" });
  }

  try {
    const salaExistente = await roomModel.findRoomByName(nombre);

    if (salaExistente) {
      return res.status(400).json({ mensaje: "Ya existe una sala con ese nombre" });
    }

    const passwordHash = tipo === "privada" ? await hashSimplePassword(password) : null;
    const sala = await roomModel.createRoom({
      nombre,
      tipo,
      passwordHash,
      creadaPor: idUsuario,
    });

    await roomModel.addUserToRoom(idUsuario, sala.id);

    await logModel.createLog({
      idUsuario,
      accion: "CREAR_SALA",
      descripcion: `Se creo la sala ${sala.nombre}`,
    });

    return res.status(201).json({
      mensaje: "Sala creada correctamente",
      sala,
    });
  } catch (error) {
    console.error("Error al crear sala:", error);
    return res.status(500).json({ mensaje: "Error al crear la sala" });
  }
}

async function joinRoom(req, res) {
  const { idUsuario, idSala } = req.body;

  if (!idUsuario || !idSala) {
    return res.status(400).json({ mensaje: "Faltan datos para unirse a la sala" });
  }

  try {
    const sala = await roomModel.findRoomById(idSala);

    if (!sala) {
      return res.status(404).json({ mensaje: "La sala no existe" });
    }

    if (sala.tipo === "privada") {
      const tieneAcceso = await roomModel.userHasAccessToRoom(idUsuario, idSala);

      if (!tieneAcceso) {
        return res.status(403).json({
          mensaje: "Debes entrar a la sala privada con nombre y contraseña",
        });
      }
    }

    await roomModel.addUserToRoom(idUsuario, idSala);

    await logModel.createLog({
      idUsuario,
      accion: "UNIRSE_SALA",
      descripcion: `El usuario entro a la sala ${sala.nombre}`,
    });

    return res.json({ mensaje: "Usuario unido a la sala" });
  } catch (error) {
    console.error("Error al unirse a sala:", error);
    return res.status(500).json({ mensaje: "Error al unirse a la sala" });
  }
}

async function joinPrivateRoom(req, res) {
  const { idUsuario, nombreSala, password } = req.body;

  if (!idUsuario || !nombreSala || !password) {
    return res.status(400).json({ mensaje: "Faltan datos para entrar a la sala privada" });
  }

  try {
    const sala = await roomModel.findRoomByName(nombreSala);

    if (!sala || sala.tipo !== "privada") {
      return res.status(404).json({ mensaje: "No existe una sala privada con ese nombre" });
    }

    const passwordCorrecta = await comparePassword(password, sala.contrasena);

    if (!passwordCorrecta) {
      return res.status(401).json({ mensaje: "La contraseña de la sala es incorrecta" });
    }

    await roomModel.addUserToRoom(idUsuario, sala.id);

    await logModel.createLog({
      idUsuario,
      accion: "ENTRAR_SALA_PRIVADA",
      descripcion: `El usuario entro a la sala privada ${sala.nombre}`,
    });

    return res.json({
      mensaje: "Entraste a la sala privada",
      sala: {
        id: sala.id,
        nombre: sala.nombre,
        tipo: sala.tipo,
      },
    });
  } catch (error) {
    console.error("Error al entrar a sala privada:", error);
    return res.status(500).json({ mensaje: "Error al entrar a la sala privada" });
  }
}

module.exports = {
  getRooms,
  createRoom,
  joinRoom,
  joinPrivateRoom,
};
