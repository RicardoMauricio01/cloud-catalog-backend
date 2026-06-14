const bcrypt = require("bcrypt");
const UserDao = require("../dao/userDao");

const UserService = {

    async getAll() {
        return await UserDao.findAll();
    },

    async getById(id) {
        return await UserDao.findById(id);
    },

    async register({ username, password }) {
        const hashed = await bcrypt.hash(password, 10);
        return await UserDao.create({ username, password: hashed });
    },

    async update(id, { username, password }) {
        const hashed = await bcrypt.hash(password, 10);
        return await UserDao.update(id, { username, password: hashed });
    },

    async delete(id) {
        await UserDao.delete(id);
    }
};

module.exports = UserService;
