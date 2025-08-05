const pool = require("../config/db");

// Obtener todos los clientes
exports.getAllClientes = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM clientes");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener cliente por ID
exports.getClienteById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM clientes WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Cliente no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear cliente
exports.createCliente = async (req, res) => {
  const { razonSocial, rut, email, fono, contacto, centroMedico } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO clientes 
       (razonSocial, rut, email, fono, contacto, centroMedico, created_at, update_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [razonSocial, rut, email, fono, contacto, centroMedico]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar cliente
exports.updateCliente = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    await pool.query("UPDATE clientes SET ? , update_at = NOW() WHERE id = ?", [
      data,
      id,
    ]);
    res.json({ message: "Cliente actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar cliente
exports.deleteCliente = async (req, res) => {
  try {
    await pool.query("DELETE FROM clientes WHERE id = ?", [req.params.id]);
    res.json({ message: "Cliente eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
