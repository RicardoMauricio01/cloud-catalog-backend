const productService = require("../services/productService");

// GET todos
exports.getProducts = async (req, res) => {
    try {
        const products = await productService.getProducts();

        res.json(products);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Error obteniendo productos",
        });
    }
};

// GET por ID
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await productService.getProductById(id);

        if (!product) {
            return res.status(404).json({
                error: "Producto no encontrado",
            });
        }

        res.json(product);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Error obteniendo producto",
        });
    }
};

// POST
exports.createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body);

        res.status(201).json(product);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Error creando producto",
        });
    }
};

// PUT
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await productService.updateProduct(id, req.body);

        res.json(updated);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Error actualizando producto",
        });
    }
};

// DELETE lógico
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        await productService.deleteProduct(id);

        res.json({
            ok: true,
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Error eliminando producto",
        });
    }
};
