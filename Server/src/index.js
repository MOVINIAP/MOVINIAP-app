require('dotenv').config();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const morgan = require('morgan');

//Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
// app.use(cors({
//   origin: 'http://localhost:4200', // Cambia esta URL al dominio que quieres permitir
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
//   credentials: true, // Habilita el envío de cookies y credenciales
//   optionsSuccessStatus: 204 // Código de estado para las solicitudes OPTIONS exitosas
// }));
// app.use(express.urlencoded({extended:false}));

//Routes
app.use(require('./routes/users.route'));
app.use(require('./routes/empleados.route'));
app.use(require('./routes/solicitudes.route'));
app.use(require('./routes/vehiculos.route'));
app.use(require('./routes/unidades.route'));
app.use(require('./routes/ciudades.route'));
app.use(require('./routes/informes.route'));
app.use(require('./routes/bancos.route'));
app.use(require('./routes/ordenesMovilizacion.route'));

app.listen(3000);
console.log('servidor en puerto 3000');
