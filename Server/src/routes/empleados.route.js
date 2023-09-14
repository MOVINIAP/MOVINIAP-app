const { Router } = require('express');
const router = Router();

const { getAllEmployees, getEmployeeById, getCompaneros } = require('../controllers/empleados.controller');

// Rutas
router.get('/empleados', getAllEmployees);
router.get('/empleados/:id', getEmployeeById);
router.get('/empleados/:id/companeros', getCompaneros);

module.exports = router;
