const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const sessions = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const { error, log } = require('console');

app.use(cors());

app.set('view engine', 'ejs');
app.set('views', 'GESTION');

const route = express.Router();
const route2 = express.Router();

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
  
  // Recuperation de la liste de tout les etudiants
  static aff(req, res) {
    connexion.query('SELECT * FROM etudiant', (error, result) => {
      if (error) {
        console.log('Erreur sur la requête de recuperation');
        res.status(500).json({ error: 'Erreur sur la requête de recuperation' });
      } else {
        res.json({ etudiant: result });
      }
    });
  }

      //  Ajout d'etudiant
      static add(req, res) {
     
        let nom = 'Momo';
        let prenoms = 'Kablan';
        let age = '2022-10-25';
        let usernames = 'mmm';
        let password = '33333';
    
        // Parameterized query to prevent SQL injection
        const query = 'INSERT INTO etudiant (nom, prenoms, datenaiss, username, password) VALUES (?, ?, ?, ?, ?)';
        const values = [nom, prenoms, age, usernames, password];
    
        connexion.query(query, values, (error) => {
            if (error) {
                console.error('Erreur sur la requête d\'insertion:', error);
                res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'étudiant' });
            } else {
                res.json({ result: 'Étudiant ajouté' });
            }
        });
    }
 
      // Update de 
      static update(req, res) {

        // const { nom, prenoms, age, usernames, passwords } = req.body;
  
        let nom = 'dermin';
        let prenoms = 'gouli';
        let age = '2024-12-25'; 
        let usernames = 'user2024';
        let passwords = '20242024';
    
        // Parameterized query to prevent SQL injection
        const query = 'UPDATE etudiant SET nom = ?, prenoms = ?, datenaiss = ?, username = ?, password = ? WHERE idetudiant = ?';
        const values = [nom, prenoms, age, usernames, passwords, 2]; 
        connexion.query(query, values, (error, results) => {
            if (error) {
                console.error('Erreur de requête de mise à jour des données:', error);
            } else {
                res.json({ result: 'Étudiant modifié' });
            }
        });
    }
// Suppression
  static delete(req, res) {
    const query = 'DELETE FROM etudiant WHERE idetudiant = ?'
    const value = [2]
    connexion.query(query, value, (error) => {
      if (error) {
        console.log('Erreur de requête de supression0', error)
      }else{
        res.json({ result: 'Étudiant suprimé' });
      }
      // res.status(200).redirect('/index');
    });
  }

  static destroy(req, res) {
    req.sessions.destroy((error) => {
      if (error) console.log(error);
    });
    // res.redirect('/index');
  }
}
class Element2 {
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
  
  // Recuperation de la liste de tout les etudiants
  static aff(req, res) {
    connexion.query('SELECT * FROM pigier.professeur', (error, result) => {
      if (error) console.log('Erreur sur la requête de recuperation', error);
      res.json({ encadreur: result });
    });
  }

      //  Ajout d'etudiant
      static add(req, res) {
     
        let nom = 'ange';
        let prenoms = 'ama';
        let enseignement = 'comptablite';
      
    
        // Parameterized query to prevent SQL injection
        const query = 'INSERT INTO professeur (nom, prenoms, enseignement) VALUES (?, ?, ?)';
        const values = [nom, prenoms, enseignement];
    
        connexion.query(query, values, (error) => {
            if (error) {
                console.error('Erreur sur la requête d\'insertion:', error);
                res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'encadreur' });
            } else {
                res.json({ result: 'Encadreur ajouté' });
            }
        });
    }
 
      // Update de 
      static update(req, res) {

        // const { nom, prenoms, age, usernames, passwords } = req.body;
  
        let nom = 'kple';
        let prenoms = 'ive';
        let enseignement = 'economie'; 
    
        const query = 'UPDATE professeur SET nom = ?, prenoms = ?, enseignement = ? WHERE idprofesseur = ?';
        const values = [nom, prenoms, enseignement, 1]; 
        connexion.query(query, values, (error, results) => {
            if (error) {
                console.error('Erreur de requête de mise à jour des données:', error);
            } else {
                res.json({ result: 'Encadreur modifié' });
            }
        });
    }
// Suppression
  static delete(req, res) {
    const query = 'DELETE FROM professeur WHERE idprofesseur = ?'
    const value = [2]
    connexion.query(query, value, (error) => {
      if (error) {
        console.log('Erreur de requête de supression0', error)
      }else{
        res.json({ result: 'Encadreur suprimé' });
      }
      // res.status(200).redirect('/index');
    });
  }

  static destroy(req, res) {
    req.sessions.destroy((error) => {
      if (error) console.log(error);
    });
    // res.redirect('/index');
  }
}

// Les routes pour etudiants
route.get('/liste', Element.aff);
route.get('/ajout', Element.add);
route.get('/edit', Element.update);
route.get('/delete', Element.delete);



// Les routes pour encadreur
route2.get('/liste', Element2.aff);
route2.get('/ajout', Element2.add);
route2.get('/edit', Element2.update);
route2.get('/delete', Element2.delete);
module.exports = {route, route2};