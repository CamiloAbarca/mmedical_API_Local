const pool = require("../config/db");

// Obtener todos los historiales
exports.getAllHistorial = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM historial");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener historial por ID
exports.getHistorialById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM historial WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Historial no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener historial por equipo
exports.getHistorialByEquipo = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM historial WHERE id_equipo = ?",
      [req.params.idEquipo]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear historial
exports.createHistorial = async (req, res) => {
  const { id_equipo, detalle, fecha } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO historial (id_equipo, detalle, fecha)
       VALUES (?, ?, ?)`,
      [id_equipo, detalle, fecha]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar historial
exports.updateHistorial = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    await pool.query("UPDATE historial SET ? WHERE id = ?", [data, id]);
    res.json({ message: "Historial actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar historial
exports.deleteHistorial = async (req, res) => {
  try {
    await pool.query("DELETE FROM historial WHERE id = ?", [req.params.id]);
    res.json({ message: "Historial eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
