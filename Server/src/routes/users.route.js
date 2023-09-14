const {Router} = require('express');
const router = Router();

const { 
    getListUser,
    createUser, 
    getUserById, 
    deleteUser, 
    uptadeUser, 
    loginUser, 
    registerUser, 
    getUserProfile 
} = require("../controllers/users.controller");

const { verifyToken } = require("../middleware/auth");


router.get('/usuarios', getListUser);
router.get('/usuarios/:id', getUserById);
router.post('/usuarios', createUser);
router.put('/usuarios/:id', uptadeUser);
router.delete('/usuarios/:id', deleteUser);

// Ruta para el registro de usuarios
router.post('/register', registerUser);

// Ruta para el inicio de sesión
router.post('/login', loginUser);

// Ruta para obtener información del usuario autenticado
router.get('/profile', verifyToken, getUserProfile);


module.exports = router;