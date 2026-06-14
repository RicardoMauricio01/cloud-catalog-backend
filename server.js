require("./config/env");

const express = require("express");
const cors = require("cors");
const path = require("path");

const pool = require("./config/db");

const testRoutes = require("./routes/testRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend/pages")));
app.use("/css", express.static(path.join(__dirname, "../frontend/css")));
app.use("/js", express.static(path.join(__dirname, "../frontend/js")));

app.use("/", testRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("==========================================");
    console.log("SERVIDOR CLOUD CATALOG ARRANCADO");
    console.log(`Puerto: ${PORT}`);
    console.log(`Entorno: ${process.env.NODE_ENV}`);
    console.log("==========================================");
});

process.on("SIGINT", async () => {
    console.log("\nCerrando servidor...");
    await pool.end();
    console.log("Pool PostgreSQL cerrado correctamente.");
    process.exit(0);
});
