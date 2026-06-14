const UserService = require("../services/userService");
const UserDto = require("../dtos/userDto");

exports.getUsers = async (req, res) => {
    try {
        const users = await UserService.getAll();
        res.json(UserDto.list(users));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error obteniendo usuarios" });
    }
};

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Usuario y contraseña requeridos" });
        }

        const user = await UserService.register({ username, password });
        res.status(201).json(UserDto.single(user));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error registrando usuario" });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Usuario y contraseña requeridos" });
        }

        const updated = await UserService.update(req.params.id, { username, password });

        if (!updated) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(UserDto.single(updated));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error actualizando usuario" });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await UserService.delete(req.params.id);
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error eliminando usuario" });
    }
};
