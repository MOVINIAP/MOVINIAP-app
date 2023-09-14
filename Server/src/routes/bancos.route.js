const {Router} = require('express');
const router = Router();

const { getAllBancos } = require('../controllers/bancos.controller');

const { verifyToken, ROLES, authorizeRole } = require("../middleware/auth");

// Rutas

router.get('/informes', getAllBancos);


module.exports = router;