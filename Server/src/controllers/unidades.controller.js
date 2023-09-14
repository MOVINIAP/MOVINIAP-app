const { pool } = require("../connection/connection");

// Obtener listado de vehículos
const getAllUnidades = async (req, res) => {
    const query = "SELECT * FROM unidades_obtener_info_todas_unidades();";
    const response = await pool.query(query);
    res.status(200).json(response.rows);
}


module.exports = {
    getAllUnidades,
}