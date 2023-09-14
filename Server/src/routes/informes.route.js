const {Router} = require('express');
const router = Router();

const { getAllInformes, getInformesByEmployeeId } = require('../controllers/informes.controller');

const { verifyToken, ROLES, authorizeRole } = require("../middleware/auth");

// Rutas

router.get('/informes', getAllInformes);
// router.get('/informes/:id', getInformeById);
router.get('/informes/empleado/:id', getInformesByEmployeeId);

module.exports = router;