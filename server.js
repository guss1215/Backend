const express = require('express');
const admin = require('firebase-admin');
const app = express();

// Configurar el SDK de administración de Firebase
const serviceAccount = require('./webformunitas-firebase-adminsdk-e05sb-0892f8f00d.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Crear una instancia de Firestore
const db = admin.firestore();

// Configurar middleware para analizar los datos del formulario
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ruta para recibir los datos del formulario
app.post('/', (req, res) => {
  const formData = req.body;

  // Insertar los datos en la base de datos
  const collectionRef = db.collection('unitasform'); // Reemplaza 'tabla_ong' con el nombre de tu colección en Firestore
  collectionRef
    .add(formData)
    .then(() => {
      console.log('Datos insertados exitosamente en la base de datos');
      res.status(200).send('Datos insertados exitosamente');
    })
    .catch((error) => {
      console.error('Error al insertar los datos:', error);
      res.status(500).send('Error al procesar la solicitud');
    });
});

// Iniciar el servidor
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Servidor backend iniciado en http://localhost:${port}`);
});
