const { pool } = require("../connection/connection");

// Obtener listado de vehículos
const getAllCiudades = async (req, res) => {
    const query = "SELECT * FROM ciudades;";
    const response = await pool.query(query);
    res.status(200).json(response.rows);
}


module.exports = {
    getAllCiudades,
}