const jwt = require('jsonwebtoken');
require('dotenv').config();

const ROLES = {
  SUPERADMIN: '1',
  ADMIN: '2',
  USUARIO: '3',
};

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token inválido' });
  }
};

// Middleware de autorización
const authorizeRole = (requiredRoles) => (req, res, next) => {
  const userRole = req.user.id_rol;
  if (requiredRoles.includes(userRole)) {
    next(); // Usuario autorizado
  } else {
    res.status(403).json({ message: 'Acceso denegado' });
  }
};

module.exports = {
  ROLES,
  verifyToken,
  authorizeRole,
};
