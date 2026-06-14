const ProductService = require("../services/productService");
const ProductDto = require("../dtos/productDto");

exports.getProducts = async (req, res) => {
    try {
        const products = await ProductService.getAll();
        res.json(ProductDto.list(products));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error obteniendo productos" });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await ProductService.getById(req.params.id);

        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json(ProductDto.single(product));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error obteniendo producto" });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const product = await ProductService.create(req.body);
        res.status(201).json(ProductDto.single(product));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error creando producto" });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const updated = await ProductService.update(req.params.id, req.body);

        if (!updated) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json(ProductDto.single(updated));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error actualizando producto" });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await ProductService.delete(req.params.id);
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error eliminando producto" });
    }
};
