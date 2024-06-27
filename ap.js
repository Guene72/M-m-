const { route, route2 } = require('./routes/routes.js');
const nodemailer = require('nodemailer')
const express = require('express');
const mysql = require('mysql2');
const sessions = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const fs = require('fs');
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/login', (req, res) => {
    // const { username, password } = req.body;
    let username = 'gm';
    let password = '123456';
    
    // Si l'utilisateur est un étudiant 
    connexion.query(`SELECT userame, password, profil FROM etudiant WHERE userame = ? AND password = ?`, [username, password], (error, result) => {
        if (error) {
            console.log('Erreur de connexion à etudiant //', error);
            return res.status(500).json({ error: 'Database query error' });
        }
        if (result.length > 0) {
           res.json({resultat:result})
        } else {
            // Si l'utilisateur est un admin
            connexion.query(`SELECT username, password, profil FROM admin WHERE username = ? AND password = ?`, [username, password], (error, result) => {
                if (error) {
                    console.log('Erreur sur la connexion de l\'admin', error);
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
    connexion.query('SELECT nom, prenoms, theme,nomfiliere, objspecifique, objgeneral, problematique, environdevelop, statut FROM etudiant JOIN filiere ON etudiant.idfiliere = filiere.idfiliere JOIN donnetheme ON donnetheme.idetudiant = etudiant.idetudiant', (error, results) => {
        if (error) {
            console.log('Erreur lors de la récupération des demandes', error);
        
        } else {
            return res.json({ resultats: results });
        }
    });
});

// Effectuer une demande 
app.get('/demandes', (req, res) => {
    // Données etudiant
    let nom = 'Gaoussou';
    let prenoms = 'fiero';
    let datenaiss = '2022-10-25';
    let username = 'Nfk';
    let password = '123456';
    let filiere = 'commerciale';
    let filieres = ['RGL', 'comptabilite', 'commerciale', 'ressource humaine', 'assistante de direction'];
    // Données concernant le theme

    let theme = 'Gestion de terrain'
    let ObjSpecifique = 'Personnelle'
    let ObjGeneral = 'Pour le bien etre'
    let Prblm = 'gestion manuelle'
    let Environnement = 'VSCode '

    if (filieres.includes(filiere)) {
        const query1 = 'INSERT INTO etudiant (nom, prenoms, datenaiss, userame, password, idfiliere) VALUES (?, ?, ?, ?, ?, ?)';
        const values1 = [nom, prenoms, datenaiss, username, password, (filieres.indexOf(filiere) + 1)];
        connexion.query(query1, values1, (error, result) => {
            if (error) {
                console.log('Erreur d\'ajout de la demande', error);  
            } else {
                 const etudiantId = result.insertId
                 const query = 'INSERT INTO donnetheme (theme, objspecifique, objgeneral, problematique, environdevelop, idetudiant) VALUES (?, ?, ?, ?, ?, ?)'
                 const value = [theme, ObjSpecifique, ObjGeneral, Prblm, Environnement, etudiantId]
                 connexion.query(query,value,(error, result)=>{
                    if(error){
                        res.json({Erreur:'Erreur de l\'ajout',error})
                    }else{
                        res.json({resultat:'Donnnées ajouté avec succes'})
                    }
                 })
            }
        });
    } else {
        return res.status(400).json({ error: 'Invalid filiere' });
    }
});

// Les updates du statut refusé
app.get('/statut-no', (req, res) => {
    const idEtudiant = parseInt(req.body.idetudiant);
    const motif = req.body.motif;
    let requet = `UPDATE donnetheme SET statut = 'Refuse', motif = ? WHERE idetudiant = ?`;
    
    connexion.query(requet, [motif, idEtudiant], (err, result) => {
        if (err) {
            return res.json({ erreur: 'Erreur de statut', err });
        } else {
            connexion.query('SELECT email, motif FROM etudiant JOIN donnetheme ON donnetheme.idetudiant = etudiant.idetudiant WHERE donnetheme.idetudiant = ?', [idEtudiant], (errorr, result) => {
                if (errorr) {
                    console.log(errorr);
                    return res.json({ erreur: 'Erreur de récupération du mail', errorr });
                } else {
                    let transporter = nodemailer.createTransport({
                        service: 'Outlook365',
                        host: 'smtp-mail.outlook.com',
                        port: 587,
                        secure: false,
                        auth: {
                            user: 'moumouniguene@outlook.com',
                            pass: 'Moumouni79'
                        }
                    });
                    
                    let message = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title></head><style>body{display: flex;align-items: center;justify-content: center;}div{border-radius: 10px;width: 500px;display: flex;background-color: rgb(191, 213, 233);flex-direction: column;align-items: center;justify-content: center;}div p{color: black;font-weight: bold;}div .p1{color: black;font-size: 21px;text-decoration: underline;font-weight: bold;}div span{color: rgb(253, 0, 0);font-weight: bold;}.un{display: flex;flex-direction: column;align-items: center;justify-content: center}</style><body><div> <p class="p1">Demande de soutenance</p><div class="un"><p>Votre demande de soutenance est :</p><span>REFUSE</span> <p>Pour motif suivant: ${result[0].motif}</p></div></div></body></html>`;
                    
                    let mailOptions = {
                        from: 'SOUTENANCE PIGIER <moumouniguene@outlook.com>',
                        to: result[0].email,
                        subject: 'REPONSE DE LA DEMANDE',
                        text: 'Refusé',
                        html: message
                    };
                    
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return res.json({ message: 'Email non envoyé', error });
                        }
                        return res.json({ resultat: 'Email de refus envoyé' });
                    });
                }
            });
        }
    });
});
// Les updates du statut valider
app.get('/statut-yes', (req, res) => {
    let idEtudiant = req.body.idetudiant;
    let requet = `UPDATE donnetheme SET statut = 'Valider' WHERE idetudiant = ?`;
    
    connexion.query(requet, [idEtudiant], (err, result) => {
        if (err) {
            return res.json({ erreur: 'Erreur de statut', err });
        } else {
            connexion.query('SELECT email FROM etudiant WHERE idetudiant = ?', [idEtudiant], (errorr, result) => {
                if (errorr) {
                    return res.json({ resultat: 'Erreur de récupération du mail' });
                }
                
                let transporter = nodemailer.createTransport({
                    service: 'Outlook365',
                    host: 'smtp-mail.outlook.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: 'moumouniguene@outlook.com',
                        pass: 'Moumouni79'
                    }
                });
                
                let message = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title></head><style>body{display: flex;align-items: center;justify-content: center;}div{border-radius: 10px;width: 500px;display: flex;background-color: rgb(191, 213, 233);flex-direction: column;align-items: center;justify-content: center;}div p{color: black;font-weight: bold;}div .p1{color: black;font-size: 21px;text-decoration: underline;font-weight: bold;}div span{color: rgb(253, 0, 0);font-weight: bold;}.un{display: flex;flex-direction: column;align-items: center;justify-content: center}</style><body><div> <p class="p1">Demande de soutenance</p><div class="un"><p>Votre demande de soutenance est :</p><span>ACCEPTER</span> <p>Votre rendez-vous est pour le : 18/08/2024</p></div></div></body></html>`;
                
                let mailOptions = {
                    from: 'SOUTENANCE PIGIER <moumouniguene@outlook.com>',
                    to: result[0].email,
                    subject: 'REPONSE DE LA DEMANDE',
                    text: 'Accepté',
                    html: message
                };
                
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return res.json({ resultat: 'Email non envoyé' });
                    }
                    console.log('Message envoyé: %s', info.messageId);
                    return res.json({ resultat: 'Email envoyé' });
                });
            });
        }
    });
});

app.post('/fichier', (req, res) => {
    let filepath;
    if (req.body && req.body.filepath) {
        filepath = req.body.filepath;

        if (!fs.existsSync(filepath)) {
            return res.status(400).json({ error: 'Chemin non correct' });
        }
        const filename = path.basename(filepath);
        const data = fs.readFileSync(filepath);
        const bases = data.toString('base64')

        const queri = 'INSERT INTO document (nomdoc, bulletin) VALUES (?, ?)'
        connexion.query(queri,[filename, bases], (error, result)=>{
            if(error) res.json({Erreur: 'Erreur d\'insertion de l\'image', error})
            else res.json({resultat:'Fichier inseré avec succés'})
        })
    } else {
        console.log('Chemin du fichier invalide');
        return res.status(400).json({ error: 'Chemin pas retrouvé' });
    }
});
app.get('/images',(req, res)=>{
    const ress = 'SELECT * FROM document'
    connexion.query(ress,(error, result)=>{
        if(error) console.log(error);
        if (result.length > 0) {
            const file = result[0];
            const imgBuffer = Buffer.from(file.bulletin, 'base64');
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="${file.nomdoc}"`
            });
            res.end(imgBuffer);
        } else {
            return res.status(404).json({ error: 'File not found' });
        }
    })
})

app.use('/etudiant', route);
app.use('/encadreur', route2);

app.listen(3001, () => {
    console.log(`Serveur démarré sur http://localhost:3001`);
});
