const { pool } = require('../connection/connection');

const getAllEmployees = async (req, res) => {
  const query = `SELECT distintivo, empleado_nombres, cargo, nombre_unidad, nombre_banco, tipo_cuenta, numero_cuenta FROM empleados_obtener_info_empleados_todos();`;
  const response = await pool.query(query);
  console.log(response);
  res.json(response.rows);
};

const getEmployeeById = async (req, res) => {
  const id = req.params.id;
  const response = await pool.query(
    `
      select * from obtener_info_empleado($1);
      `,
    [id]
  );
  console.log(response);
  res.json(response.rows);
};

// Recibe id empleado
const getCompaneros = async (req, res) => {
  const idEmpleado = req.params.id;
  const query = `SELECT * FROM empleado_obtener_companeros($1);`;
  const params = [idEmpleado];
  try {
    const response = await pool.query(query, params);
    res.status(200).json(response.rows);
  } catch (error) {
    console.log('Error al obtener compañeros: ', error);
    res.status(500).json({ message: 'Error al obtener compañeros' });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  getCompaneros,
};
