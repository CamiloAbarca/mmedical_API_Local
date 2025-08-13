const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const usuariosController = require("../controllers/usuarios.controller");
const authMiddleware = require("../middlewares/auth");

// Validaciones
const usuarioValidation = [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
  body("apellido").notEmpty().withMessage("El apellido es obligatorio"),
  body("rut").notEmpty().withMessage("El RUT es obligatorio"),
  body("email").isEmail().withMessage("Debe ser un email válido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
];

// Rutas
router.get("/", authMiddleware, usuariosController.getAllUsuarios);
router.post("/register", usuarioValidation, usuariosController.registerUsuario);
router.post("/login", usuariosController.loginUsuario);
router.put("/:id", usuariosController.updateUsuario);
router.delete("/:id", usuariosController.deleteUsuario);
router.put(
  "/change-password/:id",
  authMiddleware,
  usuariosController.changePassword
); // NUEVA RUTA PARA CAMBIO DE CONTRASEÑA

module.exports = router;
