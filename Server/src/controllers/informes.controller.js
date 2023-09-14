const { pool } = require("../connection/connection");

// Obtener listado de vehículos
const getAllInformes = async (req, res) => {
    const query = "SELECT * FROM informes_listar_informes();";
    const response = await pool.query(query);
    res.status(200).json(response.rows);
}

// Obtener listado de solicitudes por Id de empleado
const getInformesByEmployeeId =  async (req, res) => {
    const id = req.params.id;
    const text = 'SELECT * FROM informes_listar_informes_por_empleado($1)';
    const params = [id];
    const response = await pool.query(
        text, params
    );
    res.status(200).json(response.rows);
};


module.exports = {
    getAllInformes,
    getInformesByEmployeeId,
}