const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// Obtener todos los usuarios
exports.getAllUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nombre, apellido, rut, email, tipo, created_at FROM usuarios"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Registrar usuario
exports.registerUsuario = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { nombre, apellido, rut, email, password, tipo = "usuario" } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO usuarios (nombre, apellido, rut, email, password, tipo, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [nombre, apellido, rut, email, hashedPassword, tipo]
    );

    res
      .status(201)
      .json({ id: result.insertId, message: "Usuario registrado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login de usuario
exports.loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0)
      return res.status(401).json({ message: "Email no encontrado" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user.id, email: user.email, tipo: user.tipo },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rut: user.rut,
        tipo: user.tipo,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Editar usuario
exports.updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, rut, email, tipo } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE usuarios SET nombre = ?, apellido = ?, rut = ?, email = ?, tipo = ?, updated_at = NOW() WHERE id = ?`,
      [nombre, apellido, rut, email, tipo, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar usuario
exports.deleteUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(`DELETE FROM usuarios WHERE id = ?`, [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cambiar contraseña de usuario (NUEVA FUNCIÓN)
exports.changePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT password FROM usuarios WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña actual incorrecta" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const [result] = await pool.query(
      "UPDATE usuarios SET password = ?, updated_at = NOW() WHERE id = ?",
      [hashedNewPassword, id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Error al actualizar la contraseña" });
    }

    res.json({ message: "Contraseña actualizada con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
