const apiroute = require('./routes/routes.js');
const express = require('express');
const sessions = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'GESTION');

app.use('/', apiroute);

app.listen(3001, () => {
    console.log(`Serveur démarré sur http://localhost:3001`);
});