const pool = require("../config/db");

// Obtener todos los equipos
exports.getAllEquipos = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM equipos");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un equipo por ID
exports.getEquipoById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM equipos WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Equipo no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener equipos por cliente
exports.getEquiposByCliente = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM equipos WHERE id_cliente = ?",
      [req.params.idCliente]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un equipo
exports.createEquipo = async (req, res) => {
  const {
    nro_serie,
    tipo,
    marca,
    modelo,
    estado,
    fecha_ingreso,
    fecha_entrega,
    fecha_mantencion,
    detalle,
    accesorios,
    id_cliente,
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO equipos 
       (nro_serie, tipo, marca, modelo, estado,
       fecha_ingreso, fecha_entrega, fecha_mantencion,
       detalle, accesorios, id_cliente, create_at, update_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        nro_serie,
        tipo,
        marca,
        modelo,
        estado,
        fecha_ingreso,
        fecha_entrega,
        fecha_mantencion,
        detalle,
        accesorios,
        id_cliente,
      ]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un equipo
exports.updateEquipo = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    await pool.query("UPDATE equipos SET ? , update_at = NOW() WHERE id = ?", [
      data,
      id,
    ]);
    res.json({ message: "Equipo actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un equipo
exports.deleteEquipo = async (req, res) => {
  try {
    await pool.query("DELETE FROM equipos WHERE id = ?", [req.params.id]);
    res.json({ message: "Equipo eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
