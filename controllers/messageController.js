// Esta capa obtiene mensajes viejos y tambien maneja el envio por sockets.

const authModel = require("../models/authModel");
const messageModel = require("../models/messageModel");
const roomModel = require("../models/roomModel");
const logModel = require("../models/logModel");

let io = null;

function setSocketServer(ioServer) {
  io = ioServer;
}

async function getMessages(req, res) {
  const idSala = Number(req.params.idSala);
  const idUsuario = Number(req.query.usuarioId);

  if (!idSala || !idUsuario) {
    return res.status(400).json({ mensaje: "Faltan datos para cargar mensajes" });
  }

  try {
    const tieneAcceso = await roomModel.userHasAccessToRoom(idUsuario, idSala);

    if (!tieneAcceso) {
      return res.status(403).json({ mensaje: "No tienes acceso a esta sala" });
    }

    const mensajes = await messageModel.getMessagesByRoom(idSala);
    return res.json(mensajes);
  } catch (error) {
    console.error("Error al obtener mensajes:", error);
    return res.status(500).json({ mensaje: "Error al obtener mensajes" });
  }
}

function handleSocketConnection(socket) {
  socket.on("unirse_sala", (idSala) => {
    socket.join(`sala-${idSala}`);
  });

  socket.on("enviar_mensaje", async (data) => {
    const { contenido, idUsuario, idSala } = data;

    if (!contenido || !idUsuario || !idSala) {
      return;
    }

    try {
      const tieneAcceso = await roomModel.userHasAccessToRoom(idUsuario, idSala);

      if (!tieneAcceso) {
        return;
      }

      const mensajeGuardado = await messageModel.createMessage({
        contenido,
        idUsuario,
        idSala,
      });

      const usuario = await authModel.findUserById(idUsuario);

      await logModel.createLog({
        idUsuario,
        accion: "ENVIAR_MENSAJE",
        descripcion: `Se envio un mensaje en la sala ${idSala}`,
      });

      const mensajeCompleto = {
        ...mensajeGuardado,
        nombre: usuario?.nombre || "Usuario",
        email: usuario?.email || "",
      };

      if (io) {
        io.to(`sala-${idSala}`).emit("nuevo_mensaje", mensajeCompleto);
      }
    } catch (error) {
      console.error("Error al enviar mensaje por socket:", error);
    }
  });
}

module.exports = {
  setSocketServer,
  getMessages,
  handleSocketConnection,
};
