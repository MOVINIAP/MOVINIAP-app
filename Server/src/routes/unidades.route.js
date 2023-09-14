const {Router} = require('express');
const router = Router();

const { getAllUnidades } = require('../controllers/unidades.controller');

const { verifyToken, ROLES, authorizeRole } = require("../middleware/auth");

// Rutas

router.get('/unidades', getAllUnidades);

module.exports = router;