const ProductDto = {

    single(product) {
        if (!product) return null;

        return {
            id: product.id,
            nombre: product.nombre,
            descripcion: product.descripcion,
            precio: Number(product.precio),
            stock: product.stock,
            imagen_url: product.imagen_url,
            activo: product.activo,
            created_at: product.created_at,
            updated_at: product.updated_at
        };
    },

    list(products) {
        return products.map(p => ProductDto.single(p));
    }
};

module.exports = ProductDto;
