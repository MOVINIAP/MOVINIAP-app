const { Router } = require('express');
const router = Router();

const { ROLES, authorizeRole, verifyToken } = require('../middleware/auth');

const { getListRequest, getListRequestsByEmployeeId, getDataRequestById, createRequest, registrarTransporteSolicitud, 
    getListRequestsAcceptedWithoutReportByEmployeeId, generateRequestPdfById, enviarSolicitud, aceptarRechazarSolicitud,
    eliminarTransporteSolicutud, editarTransporteSolicitud
  } = require('../controllers/solicitudes.controller');


// Rutas

router.get('/solicitudes', verifyToken, authorizeRole([ROLES.SUPERADMIN, ROLES.ADMIN]), getListRequest);
router.get('/solicitudes/:id', getDataRequestById);
router.get('/solicitudes/:id/generate-pdf', generateRequestPdfById);
router.get('/solicitudes/empleado/:id', getListRequestsByEmployeeId);
router.get('/solicitudes/empleado/solicitudes-sin-informe/:id', getListRequestsAcceptedWithoutReportByEmployeeId);
router.post('/solicitudes/nueva-solicitud', createRequest);
router.post('/solicitudes/:idSolicitud/transporte', registrarTransporteSolicitud);
router.put('/solicitudes/transporte/:id/editar', editarTransporteSolicitud);
router.delete('/solicitudes/transporte/:id/eliminar', eliminarTransporteSolicutud);
router.post('/solicitudes/:id/enviar-solicitud', enviarSolicitud);
router.post('/solicitudes/:id/aceptar-rechazar', aceptarRechazarSolicitud);



module.exports = router;
