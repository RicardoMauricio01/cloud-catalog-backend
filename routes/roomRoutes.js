// Esta capa define las rutas relacionadas con las salas.

const express = require("express");
const roomController = require("../controllers/roomController");

const router = express.Router();

router.get("/", roomController.getRooms);
router.post("/", roomController.createRoom);
router.post("/unirse", roomController.joinRoom);
router.post("/unirse-privada", roomController.joinPrivateRoom);

module.exports = router;
