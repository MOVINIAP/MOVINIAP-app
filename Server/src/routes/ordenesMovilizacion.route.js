const { Router } = require('express');
const router = Router();

const {
  getAllOrdenesMovilizacion,
  createOrdenMovilizacionWithoutSolicitudAdmin,
  getOrdenMovilizacionById,
  getOrdenesMovilizacionByEmpleadoId,
  cambiarEstadoOrdenMovilizacion,
} = require('../controllers/ordenesMovilizacion.controller');

const { verifyToken, ROLES, authorizeRole } = require('../middleware/auth');

// Rutas

// ADMIN, SUPERADMIN
// GET: http://localhost:3000/ordenes-movilizacion
router.get(
  '/ordenes-movilizacion',
  verifyToken,
  authorizeRole([ROLES.SUPERADMIN, ROLES.ADMIN]),
  getAllOrdenesMovilizacion
);

// ADMIN, SUPERADMIN
// POST: http://localhost:3000/ordenes-movilizacion/admin-crear
// REQUEST BODY
// {
//   "id_empleado_emisor": 38,
//   "id_empleado_solicitante": 201,
//   "id_empleado_conductor": 203,
//   "descripcion_actividades": "Actividad de prueba",
//   "id_vehiculo": 1,
//   "id_ciudad_destino": 122,
//   "secuencial_orden_movilizacion": "525",
//   "listado_empleados": "EMPLEADO 1, EMPLEADO 2",
//   "fecha_desde": "2023-10-23",
//   "hora_desde": "08:00",
//   "fecha_hasta": "2023-10-23",
//   "hora_hasta": "23:00",
//   "num_orden_mov_cge": null
// }
// ADMIN, SUPERADMIN
// POST: http://localhost:3000/ordenes-movilizacion/admin-crear
router.post(
  '/ordenes-movilizacion/admin-crear',
  verifyToken,
  authorizeRole([ROLES.SUPERADMIN, ROLES.ADMIN]),
  createOrdenMovilizacionWithoutSolicitudAdmin
);

// GET: http://localhost:3000/ordenes-movilizacion/5
router.get(
  '/ordenes-movilizacion/:id',
  verifyToken,
  authorizeRole([ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USUARIO]),
  getOrdenMovilizacionById
);

// GET: http://localhost:3000/ordenes-movilizacion/empleado/5
router.get(
  '/ordenes-movilizacion/empleado/:id',
  verifyToken,
  authorizeRole([ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USUARIO]),
  getOrdenesMovilizacionByEmpleadoId
);

// PUT: http://localhost:3000/ordenes-movilizacion/5/cambiar-estado
// PUT: http://localhost:3000/ordenes-movilizacion/:id/cambiar-estado
router.put(
  '/ordenes-movilizacion/:id/cambiar-estado',
  verifyToken,
  authorizeRole([ROLES.SUPERADMIN, ROLES.ADMIN]),
  cambiarEstadoOrdenMovilizacion
);

module.exports = router;
