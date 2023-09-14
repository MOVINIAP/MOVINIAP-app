const { pool } = require("../connection/connection");

// Obtener listado de vehículos
const getAllBancos = async (req, res) => {
    const query = "SELECT id_banco, nombre_banco FROM bancos;";
    const response = await pool.query(query);
    res.status(200).json(response.rows);
}


module.exports = {
    getAllBancos,
}