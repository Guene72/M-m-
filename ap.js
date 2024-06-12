const { route, route2 } = require('./routes/routes.js');
const express = require('express');
const mysql = require('mysql2');
const sessions = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const { error, log } = require('console');

app.set('view engine', 'ejs');
app.set('views', 'GESTION');

// Base de données
const connexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pigier'
});

// Connection à la base de données
connexion.connect((err) => {
    if (err) {
        console.log('Erreur de connexion à la base de données');
    } else {
        console.log('Connexion à la base de données effectuée');
    }
});

app.get('/login', (req, res) => {
    // const { username, password } = req.body;
    let username = 'koli';
    let password = '123456';
    
    // Si l'utilisateur est un étudiant 
    connexion.query(`SELECT * FROM etudiant WHERE userame = ? AND password = ?`, [username, password], (error, result) => {
        if (error) {
            console.log('Erreur de connexion à etudiant //', error);
            return res.status(500).json({ error: 'Database query error' });
        }
        if (result.length > 0) {
            // Page de redirection pour une bonne connexion
            return res.json({ etudiant: 'Connexion effectuée' });
        } else {
            // Si l'utilisateur est un admin
            connexion.query(`SELECT * FROM admin WHERE username = ? AND password = ?`, [username, password], (error, result) => {
                if (error) {
                    console.log('Erreur sur la connexion de l\'admin', error);
                    return res.status(500).json({ error: 'Database query error' });
                }
                if (result.length > 0) {
                    // Page de redirection pour une bonne connexion                
                    return res.json({ etudiant: result });
                } else {
                    // Sinon tu le rediriges s'il n'est ni étudiant ni admin
                    return res.json({ erreur: 'Erreur de connexion pour les deux utilisateurs' });
                }
            });
        }
    });
});

// La liste de toutes les demandes
app.get('/demandes-listes', (req, res) => {
    connexion.query('SELECT nom, prenoms, themesoutenance, nomfiliere FROM etudiant JOIN filiere ON etudiant.idfiliere = filiere.idfiliere', (error, results) => {
        if (error) {
            console.log('Erreur lors de la récupération des demandes', error);
            return res.status(500).json({ error: 'Database query error' });
        } else {
            return res.json({ resultats: results });
        }
    });
});

// Effectuer une demande 
app.get('/demandes', (req, res) => {
    let nom = 'Gaoussou';
    let prenoms = 'fiero';
    let datenaiss = '2022-10-25';
    let username = 'Nfk';
    let password = '123456';
    let filiere = 'commerciale';
    let themeSoutenance = 'Gestion d\'un magasin';

    let filieres = ['RGL', 'comptabilite', 'commerciale', 'ressource humaine', 'assistante de direction'];

    if (filieres.includes(filiere)) {
        const query1 = 'INSERT INTO etudiant (nom, prenoms, datenaiss, userame, password, themesoutenance, idfiliere) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values1 = [nom, prenoms, datenaiss, username, password, themeSoutenance, (filieres.indexOf(filiere) + 1)];
        
        connexion.query(query1, values1, (error, result) => {
            if (error) {
                console.log('Erreur d\'ajout de la demande', error);
                return res.status(500).json({ error: 'Database query error' });
            } else {
                return res.json({ resultat: result });
            }
        });
    } else {
        return res.status(400).json({ error: 'Invalid filiere' });
    }
});

app.use('/etudiant', route);
app.use('/encadreur', route2);

app.listen(3001, () => {
    console.log(`Serveur démarré sur http://localhost:3001`);
});
