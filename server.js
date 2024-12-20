const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = new sqlite3.Database(':memory:');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Tworzenie tabeli pacjentów
db.serialize(() => {
  db.run("CREATE TABLE patients (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, address TEXT)");
});

// Endpoint do zapisywania danych pacjentów
app.post('/add-patient', (req, res) => {
  const { name, age, address } = req.body;
  db.run("INSERT INTO patients (name, age, address) VALUES (?, ?, ?)", [name, age, address], function(err) {
    if (err) {
      return console.log(err.message);
    }
    res.send('Dane pacjenta zostały zapisane');
  });
});

// Serwowanie pliku HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Uruchomienie serwera
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});