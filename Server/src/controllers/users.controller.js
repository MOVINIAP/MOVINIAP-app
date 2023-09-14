const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { pool } = require("../connection/connection");
require('dotenv').config();

const getListUser = async (req, res)=>{
    const response = await pool.query(`
    SELECT u.id_usuario, p.id_persona, p.numero_cedula, p.nombres || ' ' || p.apellidos AS empleado, u.usuario, u.contrasenia
    FROM usuarios u
    JOIN personas p ON u.id_persona = p.id_persona
    JOIN empleados e ON p.id_persona = e.id_persona;`);
    res.status(200).json(response.rows);
}
const getUserById = async (req, res)=>{
    const id = req.params.id;
    const response = await pool.query(`SELECT u.id_usuario, p.id_persona, p.numero_cedula, p.nombres || ' ' || p.apellidos AS empleado, u.usuario, u.contrasenia
    FROM usuarios u
    JOIN personas p ON u.id_persona = p.id_persona
    JOIN empleados e ON p.id_persona = e.id_persona where u.id_usuario=$1;`,[id] )
    res.json(response.rows);
}

const createUser = async (req, res)=>{
    const {numero_cedula, nombres, apellidos, 
        fecha_nacimiento, genero, celular, direccion, correo_electronico,
        usuario, contrasenia, id_rol,
        distintivo, fecha_ingreso, id_tipo_licencia, id_cuenta_bancaria, id_cargo,id_unidad} = req.body;
    const response = await pool.query('SELECT insertar_usuario_empleado($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)',
        [
          numero_cedula, nombres, apellidos, fecha_nacimiento, genero, celular, direccion, correo_electronico,
          usuario, contrasenia, id_rol,
          distintivo, fecha_ingreso, id_tipo_licencia, id_cuenta_bancaria, id_cargo, id_unidad
        ]);
    console.log(response);
    res.send('usuario creado');
    };

const uptadeUser = async (req,res)=>{
        const id = req.params.id;
        const {numero_cedula, nombres, apellidos, 
            fecha_nacimiento, genero, celular, direccion, correo_electronico,
            usuario, contrasenia, id_rol,
            distintivo, fecha_ingreso, id_tipo_licencia, id_cuenta_bancaria, id_cargo,id_unidad} = req.body;
        const response = await pool.query('SELECT actualizar_usuario_empleado($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)', 
        [id, numero_cedula, nombres, apellidos, 
            fecha_nacimiento, genero, celular, direccion, correo_electronico,
            usuario, contrasenia, id_rol,
            distintivo, fecha_ingreso, id_tipo_licencia, id_cuenta_bancaria, id_cargo,id_unidad]);
        console.log(response);
        res.json('usuario actualizado');
    }

const deleteUser = async (req,res)=>{
    const id = req.params.id;
    const response = await pool.query('SELECT eliminar_usuario($1);', [id])
    console.log(response);
    res.json(`User ${id} eliminado`);
};

const registerUser = async (req, res) => {
  try {
    // Aquí deberías validar los datos del usuario antes de registrarlos
    const { usuario, contrasenia, id_rol, id_persona } = req.body;
    const hashedPassword = await bcrypt.hash(contrasenia, 10);

    const newUser = await pool.query(
      'INSERT INTO usuarios (usuario, contrasenia, id_rol, id_persona) VALUES ($1, $2, $3, $4) RETURNING *',
      [usuario, hashedPassword, id_rol, id_persona]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
};

// Controlador para iniciar sesión
const loginUser = async (req, res) => {
  const { usuario, contrasenia } = req.body;

  try {
    // Verificar si el usuario existe en la base de datos
    const userQuery = `SELECT 
u.id_usuario,
u.usuario,
u.contrasenia,
u.id_rol,
e.id_empleado
FROM 
usuarios u 
LEFT JOIN empleados e on e.id_persona = u.id_persona
WHERE u.usuario = $1`;
    const userResult = await pool.query(userQuery, [usuario]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const user = userResult.rows[0];

    // Verificar la contraseña utilizando bcrypt
    const passwordMatch = await bcrypt.compare(contrasenia, user.contrasenia);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar un token JWT
    const tokenPayload = {
      id_usuario: user.id_usuario,
      usuario: user.usuario,
      id_rol: user.id_rol,
      id_empleado: user.id_empleado,
    };

    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      return res.status(500).json({ message: 'Error al iniciar sesión: Clave secreta no configurada' });
    }
    const tokenOptions = { expiresIn: '1h' };
    const token = jwt.sign(tokenPayload, secretKey, tokenOptions);

    res.json({ token });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    // Obtén el ID del usuario autenticado a partir del token
    const { id_usuario, rol } = req.user; // Debe haber sido verificado por el middleware

    const query = `SELECT 
u.id_usuario,
u.usuario,
u.id_rol,
e.id_empleado
FROM 
usuarios u 
LEFT JOIN empleados e on e.id_persona = u.id_persona
WHERE id_usuario = $1`;

    // Aquí puedes obtener la información del usuario a partir de su ID
    const user = await pool.query(query, [id_usuario]);

    res.json(user.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el perfil del usuario' });
  }
};




module.exports={
    getListUser,
    createUser,
    getUserById,
    deleteUser,
    uptadeUser,
    registerUser,
    loginUser,
    getUserProfile,
}