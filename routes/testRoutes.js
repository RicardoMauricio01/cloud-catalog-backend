const express = require("express");
const router = express.Router();

const testController = require("../controllers/testController");
const userController = require("../controllers/userController");

// Health
router.get("/", testController.home);
router.get("/test-db", testController.testDb);

// Usuarios CRUD
router.get("/usuarios", userController.getUsers);
router.post("/register", userController.register);
router.put("/usuarios/:id", userController.updateUser);
router.delete("/usuarios/:id", userController.deleteUser);

module.exports = router;
