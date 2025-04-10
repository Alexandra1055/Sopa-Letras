const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

const db = mysql.createConnection({
  host: 'db',
  user: 'alexandra',
  password: 'alexandra123',
  database: 'Sopa_Lletres'
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conexión exitosa con la base de datos');
  }
});

app.get('/api', (req, res) => {
  res.send('Hola des del backend Node.js!');
});

app.get('/daw/:query', (req, res) => {
  const query = decodeURIComponent(req.params.query);

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error en la consulta SQL:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Servidor Node.js escuchando en http://localhost:${port}`);
});
