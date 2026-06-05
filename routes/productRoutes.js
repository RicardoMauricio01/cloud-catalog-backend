const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

// GET todos
router.get("/", productController.getProducts);

// GET por id
router.get("/:id", productController.getProductById);

// POST crear
router.post("/", productController.createProduct);

// PUT actualizar
router.put("/:id", productController.updateProduct);

// DELETE lógico
router.delete("/:id", productController.deleteProduct);

module.exports = router;
