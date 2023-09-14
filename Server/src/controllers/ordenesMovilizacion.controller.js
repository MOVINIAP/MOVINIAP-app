const { pool } = require("../connection/connection");

// Obtener listado de vehículos
const getAllOrdenesMovilizacion = async (req, res) => {
    const query = "SELECT * FROM ordenes_movilizacion_listar_ordenes();";
    const response = await pool.query(query);
    res.status(200).json(response.rows);
}


module.exports = {
    getAllOrdenesMovilizacion,
}