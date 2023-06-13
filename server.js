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

// Configurar encabezados CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'https://webformunitas.netlify.app');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Ruta para recibir los datos del formulario
app.post('/', (req, res) => {
  const formData = req.body;

  // Insertar o actualizar los datos en la base de datos
  const collectionRef = db.collection('unitasform');
  const documentRef = collectionRef.doc(formData.institutionName); // Utiliza institutionName como ID del documento

  documentRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        const existingData = doc.data();
        const combinedData = { ...existingData, ...formData };

        return documentRef.set(combinedData);
      } else {
        return documentRef.set(formData);
      }
    })
    .then(() => {
      console.log('Datos insertados o actualizados exitosamente en la base de datos');
      res.status(200).send('Datos insertados o actualizados exitosamente');
    })
    .catch((error) => {
      console.error('Error al insertar o actualizar los datos:', error);
      res.status(500).send('Error al procesar la solicitud');
    });
});

// Ruta para buscar los datos en la base de datos
app.get('/buscar', (req, res) => {
  const { institutionName } = req.query;

  // Realizar la búsqueda en la base de datos utilizando institutionName
  const collectionRef = db.collection('unitasform'); // Reemplaza 'unitasform' con el nombre de tu colección en Firestore
  const query = collectionRef.where('institutionName', '==', institutionName).limit(1);

  query
    .get()
    .then((snapshot) => {
      let searchResults = {};

      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          searchResults = doc.data();
        });
      }

      res.json(searchResults);
    })
    .catch((error) => {
      console.error('Error al buscar los datos:', error);
      res.status(500).send('Error al procesar la solicitud');
    });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Verificar las credenciales en Firebase
  admin
    .auth()
    .getUserByEmail(username)
    .then((userRecord) => {
      // Comparar la contraseña proporcionada con la almacenada en Firebase
      return admin.auth().comparePasswords(password, userRecord.passwordHash);
    })
    .then(() => {
      // Credenciales válidas, generar el token de sesión
      return admin.auth().createCustomToken(username);
    })
    .then((customToken) => {
      res.status(200).json({ token: customToken });
    })
    .catch((error) => {
      console.error('Error al iniciar sesión:', error);
      res.status(401).json({ error: 'Credenciales inválidas' });
    });
});



// Iniciar el servidor
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Servidor backend iniciado en http://localhost:${port}`);
});
