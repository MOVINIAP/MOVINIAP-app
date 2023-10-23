const { pool } = require('../connection/connection');

// Obtener listado de vehículos
const getListVehicles = async (req, res) => {
  const query = 'SELECT * FROM vehiculos_obtener_vehiculos();';
  const response = await pool.query(query);
  res.status(200).json(response.rows);
};

module.exports = {
  getListVehicles,
};
