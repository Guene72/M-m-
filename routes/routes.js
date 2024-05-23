const express = require('express');
const mysql = require('mysql2');
const sessions = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const { error, log } = require('console');

app.set('view engine', 'ejs');
app.set('views', 'GESTION');

const route = express.Router();




// Base de données
const connexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pigier'
});

// Creation de la session
app.use(sessions({
  secret: 'La rue',
  resave: false,
  saveUninitialized: true,
}));

// Connection à la base de données
connexion.connect((err) => {
  if (err) {
    console.log('Erreur de connexion à la base de données');
  }else{
    console.log('connexion à la base de données est effectuée');
  }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));


class Element {
  // Creation de la session
  static sesion(req, res) {
    if (req.sessions.username) {
      res.render('dashbord', { username: req.sessions.username });
    } else {
      res.render('');
    }
  }
  // Lancement de la page de login
  static index(req, res) {
    res.status(200).render('login');
  }

  // Lorsqu'on soumet la page login
  static login(req, res) {
    const { username, password } = req.body;
    if (username && password) {
      // Si l'utilisateur est un étudiant 
      connexion.query('SELECT * FROM Etudiant WHERE username = ? AND password = ?', [username, password], (error, result) => {
        if (error) console.log('Erreur de connexion');
        if (result.length > 0) {
          req.sessions.loggedIn = true;
          req.sessions.username = username;
          // page de redirection pour unne bonne connexiion
          res.status(200).redirect('/');
        } else {
          // Si l'utilisateur est un admin
          connexion.query('SELECT * FROM admin WHERE username = ? AND password = ?', [username, password], (error, result) => {
            if (error) console.log('Erreur sur la connexion du professeur');
            if (result.length > 0) {
              // Page de redirection pour une bonne connexion
              res.status(200).render('/'); 
            } else {
              // Sinon tu le redirige s'il nest ni etudiant et ni admin
              res.redirect('/login');
            }
          });
        }
      });
    }
  }
  // Recuperation de la liste de tout les etudiants
  static aff(req, res) {
    connexion.query('SELECT * FROM pigier.etudiant', (error, result) => {
      if (error) console.log('Erreur sur la requête de recuperation');
      res.json({ etudiant: result });
    });
  }
  // Soumission de l'ajout des etudiant
  static post(req, res) {
    res.status(200).render('ajout');
  }
      //  Ajout d'etudiant
  static add(req, res) {
    const { nom, prenoms, age } = req.body;
    connexion.query('INSERT INTO etudiant(nom, prenoms, age) VALUES (?,?,?)', [nom, prenoms, age], (error) => {
      if (error) console.log('Erreur sur la requête d\'insertion');
      res.redirect('/index');
    });
  }
    //  Modification de l'etudiant
  static edit(req, res) {
    connexion.query(`SELECT * FROM etudiant WHERE id = ?`, [req.params.id], (error, result) => {
      if (error) console.log('Erreur de requête');
      res.status(200).render('edit', { donnees: result });
    });
  }
      // Update de 
  static update(req, res) {
    const { nom, prenoms, age } = req.body;
    connexion.query('UPDATE etudiant SET nom = ?, prenoms = ?, age = ? WHERE id = ?', [nom, prenoms, age, req.params.id], (error) => {
      if (error) console.log('Erreur de requête');
      res.status(200).redirect('/index');
    });
  }
// Suppression
  static delete(req, res) {
    connexion.query('DELETE FROM etudiant WHERE id = ?', [req.params.id], (error) => {
      if (error) console.log('Erreur de requête');
      res.status(200).redirect('/index');
    });
  }

  static destroy(req, res) {
    req.sessions.destroy((error) => {
      if (error) console.log(error);
    });
    res.redirect('/index');
  }
}

// Les routes
route.get('/etudiant', Element.aff);
route.get('/ajout', Element.post);
route.post('/ajout', Element.add);
route.get('/edit/:id', Element.edit);
route.post('/edit/:id', Element.update);
route.get('/:id', Element.delete);

module.exports = route;