const { pool } = require('../connection/connection');

// Obtener listado de solicitudes
const getListRequest = async (req, res) => {
  const response = await pool.query(`
    select * from obtener_datos_solicitudes();
    `);
  res.status(200).json(response.rows);
};

// Obtener listado de solicitudes por Id de empleado
const getListRequestsByEmployeeId = async (req, res) => {
  const id = req.params.id;
  const text = 'SELECT * FROM obtener_solicitudes_por_empleado($1)';
  const params = [id];
  const response = await pool.query(text, params);
  res.status(200).json(response.rows);
};

// Obtener listado de solicitudes por Id de empleado cuyo
// estado_solicitud sea ACEPTADA
// y que aún no tengan un informe
const getListRequestsAcceptedWithoutReportByEmployeeId = async (req, res) => {
  const id = req.params.id;
  const text =
    'SELECT * FROM obtener_solicitudes_aceptadas_sin_informes_por_empleado($1)';
  const params = [id];
  const response = await pool.query(text, params);
  res.status(200).json(response.rows);
};

// Obtener el detalle de una solicitud por ID de solicitud
const getDataRequestById = async (req, res) => {
  const idSolicitud = req.params.id;
  try {
    const query =
      'SELECT obtener_datos_solicitud_con_transporte($1) AS resultado;';
    const values = [idSolicitud];

    const result = await pool.query(query, values);
    const solicitudData = result.rows[0].resultado; // El resultado de la función JSON

    res.json(solicitudData);
  } catch (error) {
    console.error('Error al obtener los datos de la solicitud:', error);
    res
      .status(500)
      .json({ error: 'Error al obtener los datos de la solicitud' });
  }
};

const generateRequestPdfById = async (req, res) => {
  const idSolicitud = req.params.id;
  try {
    const query =
      'SELECT obtener_datos_solicitud_con_transporte_reporte($1) AS resultado;';
    const values = [idSolicitud];

    const result = await pool.query(query, values);
    const solicitudData = result.rows[0].resultado; // El resultado de la función JSON

    res.json(solicitudData);
  } catch (error) {
    console.error('Error al obtener los datos de la solicitud:', error);
    res
      .status(500)
      .json({ error: 'Error al obtener los datos de la solicitud' });
  }
};

// crear una nueva solicitud, devuelve el id_solicitud
const createRequest = async (req, res) => {
  try {
    const {
      motivo_movilizacion,
      fecha_salida_solicitud,
      hora_salida_solicitud,
      fecha_llegada_solicitud,
      hora_llegada_solicitud,
      descripcion_actividades,
      listado_empleados,
      id_empleado,
      id_ciudad_destino,
      id_tipo_om,
    } = req.body;

    const query =
      'SELECT registrar_solicitud($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) AS id_solicitud;';
    const values = [
      motivo_movilizacion,
      fecha_salida_solicitud,
      hora_salida_solicitud,
      fecha_llegada_solicitud,
      hora_llegada_solicitud,
      descripcion_actividades,
      listado_empleados,
      id_empleado,
      id_ciudad_destino,
      id_tipo_om,
    ];

    const result = await pool.query(query, values);

    const idSolicitudCreada = result.rows[0].id_solicitud;

    res.json({ id_solicitud: idSolicitudCreada });
  } catch (error) {
    console.error('Error al crear una solicitud', error);
    res.status(500).json({ error: 'Error al crear la solicitud' });
  }
};

const updateRequest = async (req, res) => {
  const idSolicitud = req.params.idSolicitud;
  const {
    motivo_movilizacion,
    fecha_salida_solicitud,
    hora_salida_solicitud,
    fecha_llegada_solicitud,
    hora_llegada_solicitud,
    descripcion_actividades,
    listado_empleados,
    id_ciudad_destino,
    id_tipo_om,
  } = req.body;
  const query =
    'SELECT solicitud_editar_solicitud($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) AS message;';
  const values = [
    idSolicitud,
    motivo_movilizacion,
    fecha_salida_solicitud,
    hora_salida_solicitud,
    fecha_llegada_solicitud,
    hora_llegada_solicitud,
    descripcion_actividades,
    listado_empleados,
    id_ciudad_destino,
    id_tipo_om,
  ];
  try {
    const result = await pool.query(query, values);

    const message = result.rows[0].message;

    res.json({ message: message });
  } catch (error) {
    console.error('Error al actualizar una solicitud', error);
    res.status(500).json({ error: 'Error al actualizar la solicitud' });
  }
};

const registrarTransporteSolicitud = async (req, res) => {
  const idSolicitud = req.params.idSolicitud;
  const {
    tipo_transporte_soli,
    nombre_transporte_soli,
    ruta_soli,
    fecha_salida_soli,
    hora_salida_soli,
    fecha_llegada_soli,
    hora_llegada_soli,
  } = req.body;

  try {
    const result = await pool.query(
      'SELECT registrar_transporte_solicitud($1, $2, $3, $4, $5, $6, $7, $8)',
      [
        tipo_transporte_soli,
        nombre_transporte_soli,
        ruta_soli,
        fecha_salida_soli,
        hora_salida_soli,
        fecha_llegada_soli,
        hora_llegada_soli,
        idSolicitud,
      ]
    );

    const nuevoIdTransporte = result.rows[0].registrar_transporte_solicitud; // Ajusta el nombre según lo que devuelva tu procedimiento almacenado

    res.status(200).json({
      message: 'Transporte registrado exitosamente',
      nuevoIdTransporte,
    });
  } catch (error) {
    console.error('Error al registrar el transporte:', error);
    res.status(500).json({ message: 'Error al registrar el transporte' });
  }
};

const editarTransporteSolicitud = async (req, res) => {
  const idTransporteSolicitud = req.params.id;
  const {
    tipo_transporte_soli,
    nombre_transporte_soli,
    ruta_soli,
    fecha_salida_soli,
    hora_salida_soli,
    fecha_llegada_soli,
    hora_llegada_soli,
  } = req.body;
  const query = `SELECT * FROM editar_transporte_solicitud($1, $2, $3, $4, $5, $6, $7, $8)`;
  const params = [
    idTransporteSolicitud,
    tipo_transporte_soli,
    nombre_transporte_soli,
    ruta_soli,
    fecha_salida_soli,
    hora_salida_soli,
    fecha_llegada_soli,
    hora_llegada_soli,
  ];
  try {
    const response = await pool.query(query, params);
    res.status(200).json(response.rows);
  } catch (error) {
    console.log('Error al enviar solicitud: ', error);
    res.status(500).json({ message: 'Error al enviar la solicitud' });
  }
};

const eliminarTransporteSolicutud = async (req, res) => {
  const idTransporteSolicitud = req.params.id;
  const query = `SELECT * FROM eliminar_transporte_solicitud($1)`;
  const params = [idTransporteSolicitud];
  try {
    const response = await pool.query(query, params);
    res.status(200).json(response.rows);
  } catch (error) {
    console.log('Error al enviar solicitud: ', error);
    res.status(500).json({ message: 'Error al enviar la solicitud' });
  }
};

// Sirve para que un empleado envie una solicitud, una vez enviada la solicitud ya no se puede modificar
const enviarSolicitud = async (req, res) => {
  const idSolicitud = req.params.id;
  const query = 'SELECT * FROM solicitud_enviar_solicitud($1)';
  const params = [idSolicitud];
  try {
    const response = await pool.query(query, params);
    res.status(200).json(response.rows);
  } catch (error) {
    console.log('Error al enviar solicitud: ', error);
    res.status(500).json({ message: 'Error al enviar la solicitud' });
  }
};

// Aceptar o rechazar solicitud
const aceptarRechazarSolicitud = async (req, res) => {
  const idSolicitud = req.params.id;
  const { estado_solicitud } = req.body;
  const query = `SELECT * FROM solicitud_aceptar_rechazar_solicitud($1, $2)`;
  const params = [idSolicitud, estado_solicitud];
  try {
    const response = await pool.query(query, params);
    res.status(200).json(response.rows);
  } catch (error) {
    console.log('Error al aceptar/rechazar solicitud: ', error);
    res.status(500).json({ message: 'Error al aceptar/rechazar la solicitud' });
  }
};

module.exports = {
  getListRequest,
  getListRequestsByEmployeeId,
  getDataRequestById,
  createRequest,
  registrarTransporteSolicitud,
  getListRequestsAcceptedWithoutReportByEmployeeId,
  generateRequestPdfById,
  enviarSolicitud,
  aceptarRechazarSolicitud,
  eliminarTransporteSolicutud,
  editarTransporteSolicitud,
  updateRequest,
};
