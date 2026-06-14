const ProductDao = require("../dao/productDao");

const ProductService = {

    async getAll() {
        return await ProductDao.findAll();
    },

    async getById(id) {
        return await ProductDao.findById(id);
    },

    async create(data) {
        return await ProductDao.create(data);
    },

    async update(id, data) {
        return await ProductDao.update(id, data);
    },

    async delete(id) {
        await ProductDao.deleteSoft(id);
    }
};

module.exports = ProductService;
