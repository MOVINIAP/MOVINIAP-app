const { pool } = require('../connection/connection');

// Obtener listado de vehículos
const getAllOrdenesMovilizacion = async (req, res) => {
  const query = 'SELECT * FROM ordenes_movilizacion_listar_ordenes();';
  const response = await pool.query(query);
  res.status(200).json(response.rows);
};

// createOrdenMovilizacionWithoutSolicitudAdmin
const createOrdenMovilizacionWithoutSolicitudAdmin = async (req, res) => {
  try {
    const {
      id_empleado_emisor,
      id_empleado_solicitante,
      id_empleado_conductor,
      descripcion_actividades,
      id_vehiculo,
      id_ciudad_destino,
      secuencial_orden_movilizacion,
      listado_empleados,
      fecha_desde,
      hora_desde,
      fecha_hasta,
      hora_hasta,
      num_orden_mov_cge,
    } = req.body;

    const query =
      'SELECT * FROM public.ordenes_movilizacion_insertar_nueva_orden_interna_sin_solicitud($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) AS result;';
    const values = [
      id_empleado_emisor,
      id_empleado_solicitante,
      id_empleado_conductor,
      descripcion_actividades,
      id_vehiculo,
      id_ciudad_destino,
      secuencial_orden_movilizacion,
      listado_empleados,
      fecha_desde,
      hora_desde,
      fecha_hasta,
      hora_hasta,
      num_orden_mov_cge,
    ];

    const result = await pool.query(query, values);

    const idOrdenMovilizacionCreada = result.rows[0].id_orden_movilizacion;

    res.json({ id_orden_movilizacion: idOrdenMovilizacionCreada });
  } catch (error) {
    console.error('Error al crear una orden de movilizacion', error);
    res.status(500).json({ error: 'Error al crear la orden de movilizacion' });
  }
};

module.exports = {
  getAllOrdenesMovilizacion,
  createOrdenMovilizacionWithoutSolicitudAdmin,
};
