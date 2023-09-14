const {Router} = require('express');
const router = Router();

const { getAllCiudades } = require('../controllers/ciudades.controller');

const { verifyToken, ROLES, authorizeRole } = require("../middleware/auth");

// Rutas

router.get('/ciudades', getAllCiudades);

module.exports = router;