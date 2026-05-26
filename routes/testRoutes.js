const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcrypt");

// GET usuarios
router.get("/usuarios", async (req, res) => {
    const result = await pool.query(
        "SELECT id, username FROM usuarios ORDER BY id ASC"
    );
    res.json(result.rows);
});

// REGISTER
router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
        "INSERT INTO usuarios (username, password) VALUES ($1, $2)",
        [username, hashed]
    );

    res.json({ ok: true });
});

// UPDATE
router.put("/usuarios/:id", async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
        "UPDATE usuarios SET username=$1, password=$2 WHERE id=$3",
        [username, hashed, id]
    );

    res.json({ ok: true });
});

// DELETE
router.delete("/usuarios/:id", async (req, res) => {
    const { id } = req.params;

    await pool.query("DELETE FROM usuarios WHERE id=$1", [id]);

    res.json({ ok: true });
});

module.exports = router;
