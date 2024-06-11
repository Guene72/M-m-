const {route, route2} = require('./routes/routes.js');


// const encadroute = require('./routes/routes.js');
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
    }else{
      console.log('connexion à la base de données est effectuée');
    }
  });

app.get('/login',(req, res)=>{
        // const { username, password } = req.body;
       let  username = 'koli'
       let  password = '123456'
          // Si l'utilisateur est un étudiant 
          connexion.query(`SELECT * FROM pigier.etudiant WHERE userame = '${username}' AND password = '${password}'`, (error, result) => {
            if (error) console.log('Erreur de connexion à etudiant //');
            if (result.length > 0) {  
              // page de redirection pour unne bonne connexiion
              res.json({etudiant: 'connexion effectuer'});
            }else{
              // Si l'utilisateur est un admin
              connexion.query(`SELECT * FROM admin WHERE username = '${username}' AND password = '${password}'`, (error, result) => {
                if (error) console.log('Erreur sur la connexion du professeur',error);
                if (result.length) {
                  // Page de redirection pour une bonne connexion                
                  res.json({etudiant:result});                    
                } else {
                  // Sinon tu le redirige s'il nest ni etudiant et ni admin
                  res.json({encadreur:'erreur de connexion au deux personnes'})
                }
              });
             }
          });
        

})
app.get('/demandes',(req, res)=>{
  // Effectuer une demandes 

  let nom = 'Gaoussou'
  let prenoms = 'fiero'
  let datenaiss = '2022-10-25'
  let username = 'Nfk'
  let password = '123456'
  let filiere = 'assistante de direction'
  let themeSoutenance = 'Gestion d\'un magasin'

      if(filiere === 'RGL'){
        const query1 = 'INSERT INTO etudiant (nom, prenoms, datenaiss, userame, password, themesoutenance, idfiliere ) VALUES (?, ?, ?, ?, ?, ?, ?)'
        const value1 = [nom, prenoms, datenaiss, username, password, themeSoutenance, 1] 
        connexion.query(query1, value1, (error, result)=>{
          if (error) {
            console.log('Erreur d\'ajout de la demande', error);  
          }else
          res.json({resultat: result})
        })
      }else if(filiere ==='comptabilite'){
        const query1 = 'INSERT INTO etudiant (nom, prenoms, datenaiss, userame, password, themesoutenance, idfiliere ) VALUES (?, ?, ?, ?, ?, ?, ?)'
        const value1 = [nom, prenoms, datenaiss, username, password, themeSoutenance, 2] 
        connexion.query(query1, value1, (error, result)=>{
          if (error) {
            console.log('Erreur d\'ajout de la demande', error);  
          }else
          res.json({resultat: result})
        })

      }else if(filiere ==='commerciale'){
        const query1 = 'INSERT INTO etudiant (nom, prenoms, datenaiss, userame, password, themesoutenance, idfiliere ) VALUES (?, ?, ?, ?, ?, ?, ?)'
        const value1 = [nom, prenoms, datenaiss, username, password, themeSoutenance, 3] 
        connexion.query(query1, value1, (error, result)=>{
          if (error) {
            console.log('Erreur d\'ajout de la demande', error);  
          }else
          res.json({resultat: result})
        })
       }else if(filiere ==='ressource humaine'){
        const query1 = 'INSERT INTO etudiant (nom, prenoms, datenaiss, userame, password, themesoutenance, idfiliere ) VALUES (?, ?, ?, ?, ?, ?, ?)'
        const value1 = [nom, prenoms, datenaiss, username, password, themeSoutenance, 4] 
        connexion.query(query1, value1, (error, result)=>{
          if (error) {
            console.log('Erreur d\'ajout de la demande', error);  
          }else
          res.json({resultat: result})
        })
       }else if(filiere ==='assistante de direction'){
        const query1 = 'INSERT INTO etudiant (nom, prenoms, datenaiss, userame, password, themesoutenance, idfiliere ) VALUES (?, ?, ?, ?, ?, ?, ?)'
        const value1 = [nom, prenoms, datenaiss, username, password, themeSoutenance, 5] 
        connexion.query(query1, value1, (error, result)=>{
          if (error) {
            console.log('Erreur d\'ajout de la demande', error);  
          }else{
            connexion.query('SELECT nom, prenoms, themesoutenance, nomfiliere FROM etudiant JOIN filiere ON etudiant.idfiliere = filiere.idfiliere',(error, results)=>{
              if(error) console.log(error);
              else res.json({resultats: results})
            }
            )
          }
          
        })
       }
})

app.use('/etudiant', route);
app.use('/encadreur', route2);

app.listen(3001, () => {
    console.log(`Serveur démarré sur http://localhost:3001`);
});
