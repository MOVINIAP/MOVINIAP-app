const {Router} = require('express');
const router = Router();

const { getAllOrdenesMovilizacion } = require('../controllers/ordenesMovilizacion.controller');

const { verifyToken, ROLES, authorizeRole } = require("../middleware/auth");

// Rutas

router.get('/ordenes-movilizacion', getAllOrdenesMovilizacion);


module.exports = router;