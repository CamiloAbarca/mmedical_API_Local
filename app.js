const express = require("express");
const cors = require("cors");

const usuariosRoutes = require("./routes/usuarios.routes");
const clientesRoutes = require("./routes/clientes.routes");
const equiposRoutes = require("./routes/equipos.routes");
const historialRoutes = require("./routes/historial.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/usuarios", usuariosRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/equipos", equiposRoutes);
app.use("/api/historial", historialRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
