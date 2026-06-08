// Esta capa define las rutas de autenticacion.

const express = require("express");
const authController = require("../controllers/authController");
const { hashUserPassword } = require("../middlewares/passwordMiddleware");

const router = express.Router();

router.post("/register", hashUserPassword, authController.register);
router.post("/login", authController.login);

module.exports = router;
