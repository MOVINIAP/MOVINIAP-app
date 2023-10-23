const { Router } = require('express');
const router = Router();

const {
  getAllEmployees,
  getEmployeeById,
  getCompaneros,
} = require('../controllers/empleados.controller');

// Rutas
// GET: http://localhost:3000/empleados
router.get('/empleados', getAllEmployees);

// recibe id empleado
// GET: http://localhost:3000/empleados/5
router.get('/empleados/:id', getEmployeeById);

// recibe id empleado
// GET: http://localhost:3000/empleados/1/companeros
router.get('/empleados/:id/companeros', getCompaneros);

module.exports = router;
