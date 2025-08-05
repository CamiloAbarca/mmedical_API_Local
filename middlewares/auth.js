const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1]; // Authorization: Bearer <token>

  if (!token)
    return res
      .status(401)
      .json({ message: "Acceso denegado. Token requerido." });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "secreto123");
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "Token inválido" });
  }
};
