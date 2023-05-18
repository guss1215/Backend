const express = require('express');
const mysql = require('mysql');
const app = express();

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Hollowknight123,.',
  database: 'unitas',
});

// Conexión a la base de datos
connection.connect((error) => {
  if (error) {
    console.error('Error al conectar a la base de datos:', error);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

// Configurar middleware para analizar los datos del formulario
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Ruta para permitir solicitudes CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.options('/formulario', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(200);
});

// Ruta para recibir los datos del formulario
app.post('/formulario', (req, res) => {
  const formData = req.body;

  // Aquí puedes realizar la lógica para insertar los datos en la base de datos
  // Por ejemplo:
  connection.query('INSERT INTO tabla_ong SET ?', formData, (error, results) => {
    if (error) {
      console.error('Error al insertar los datos:', error);
      res.status(500).send('Error al procesar la solicitud');
    } else {
      console.log('Datos insertados exitosamente en la base de datos');
      res.status(200).send('Datos insertados exitosamente');
    }
  });
});

// Iniciar el servidor
const port = 4000;
app.listen(port, () => {
  console.log(`Servidor backend iniciado en http://localhost:${port}`);
});
