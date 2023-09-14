const {Router} = require('express');
const router = Router();

const { getListVehicles } = require('../controllers/vehiculos.controller');

const { verifyToken, ROLES, authorizeRole } = require("../middleware/auth");

// Rutas

router.get('/vehiculos', verifyToken, authorizeRole([ROLES.SUPERADMIN, ROLES.ADMIN]), getListVehicles);

module.exports = router;