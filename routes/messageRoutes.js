// Esta capa define las rutas del historial de mensajes.

const express = require("express");
const messageController = require("../controllers/messageController");

const router = express.Router();

router.get("/salas/:idSala/mensajes", messageController.getMessages);

module.exports = router;
