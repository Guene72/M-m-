const {route, route2} = require('./routes/routes.js');
const nodemailer= require('nodemailer')


// const encadroute = require('./routes/routes.js');
const express=require('express')
const cors = require('cors');
const mysql = require('mysql2');
const sessions = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const app = express();
const { error, log } = require('console');


app.use(express.json());
app.use(cors());
app.use(cors({
    origin: ['http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));


app.set('view engine', 'ejs');
app.set('views', 'GESTION');


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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Nom d\'utilisateur et mot de passe requis' });
    }

    connexion.query(`SELECT * FROM etudiant WHERE username = ? AND password = ?`, [username, password], (error, result) => {
        if (error) {
            console.error('Erreur de connexion à etudiant:', error);
            return res.status(500).json({ message: 'Erreur serveur' });
        }

        if (result.length > 0) {
            const user = result[0]; // Récupérer les détails de l'utilisateur
            return res.status(200).json({
                message: 'Connexion réussie en tant qu\'etudiant',
                user: {
                    idetudiant:user.idetudiant,
                    username: user.username,
                    password: user.password,
                    profile:user.profile
                }
            });
        } else {
            connexion.query(`SELECT * FROM admin WHERE username = ? AND password = ?`, [username, password], (error, result) => {
                if (error) {
                    console.error('Erreur sur la connexion du professeur:', error);
                    return res.status(500).json({ message: 'Erreur serveur' });
                }

                if (result.length > 0) {
                    const user = result[0]; // Récupérer les détails de l'utilisateur
                    return res.status(200).json({
                        message: 'Connexion réussie en tant qu\'admin',
                        user: {
                            idadmin:user.idadmin,
                            username: user.username,
                            password: user.password,
                            profile:user.profile
                        }
                    });
                } else {
                    return res.status(401).json({ message: 'Erreur de connexion' });
                }
            });
        }
    });
});



// la liste de toutes les demandes
// La liste de toutes les demandes
// La liste de toutes les demandes
 app.get('/demandes-listes', (req, res) => {
  connexion.query(`SELECT donnetheme.iddonnetheme, etudiant.nom,etudiant.prenoms,donnetheme.email, donnetheme.annee_academique ,donnetheme.classe, donnetheme.filiere, donnetheme.classe, donnetheme.theme, donnetheme.objspecifique, donnetheme.objgeneral, donnetheme.problematique, donnetheme.environdevelop ,donnetheme.statut FROM  etudiant  JOIN  donnetheme ON donnetheme.idetudiant = etudiant.idetudiant`, (error, result) => {
       if (error) console.log('Erreur lors de la récupération des demandes', error);
             res.json({ demande: result });
     });
 });

// La liste de toutes les demandes
    // app.get('/demandes-listes', (req, res) => {
    //     connexion.query('SELECT donnetheme.iddonnetheme, etudiant.nom,etudiant.prenoms,donnetheme.annee_academique ,donnetheme.classe, donnetheme.filiere, donnetheme.classe, donnetheme.theme, donnetheme.objspecifique, donnetheme.objgeneral, donnetheme.problematique, donnetheme.environdevelop ,donnetheme.statut FROM  etudiant  JOIN  donnetheme ON donnetheme.idetudiant = etudiant.idetudiant', (error, results) => {
    //         if (error) {
    //             console.log('Erreur lors de la récupération des demandes', error);
    //         } else {
    //             for (let i = 0; i < results.length; i++) {
    //                 if(results[i].filiere ==='rgl'){
    //                     connexion.query('SELECT nom, prenoms FROM pigier.professeur WHERE enseignement ="informatique"',(error,resul)=>{
    //                         if (error) {
    //                             console.log('erreur de recup des encadreurs');
    //                         }else{
    //                             console.log(
    //                                 {
    //                                     resultat_demandes:results[i],
    //                                     listes_encadreurs:resul
    //                                 });
    //                         }
    //
    //                     })
    //                 }
    //                 else if(results[i].filiere ==='commerciale'){
    //                     connexion.query('SELECT nom, prenoms FROM pigier.professeur WHERE enseignement ="Commerciale"',(error,resul)=>{
    //                         if (error) {
    //                             console.log('erreur de recup des encadreurs');
    //                         }else{
    //                             console.log(
    //                                 {
    //                                     resultat_demandes:results[i],
    //                                     listes_encadreurs:resul
    //                                 });
    //                         }
    //                     })
    //                 }
    //                 else if(results[i].filiere ==='comptabilite'){
    //                     connexion.query('SELECT nom, prenoms FROM pigier.professeur WHERE enseignement ="Comptabilte"',(error,resul)=>{
    //                         if (error) {
    //                             console.log('erreur de recup des encadreurs');
    //                         }else{
    //                             console.log(
    //                                 {
    //                                     resultat_demandes:results[i],
    //                                     listes_encadreurs:resul
    //                                 });
    //                         }
    //                     })
    //
    //                 }
    //                 else if(results[i].filiere ==='ressource humaine'){
    //                     connexion.query('SELECT nom, prenoms FROM pigier.professeur WHERE enseignement ="Ressource Humaines"',(error,resul)=>{
    //                         if (error) {
    //                             console.log('erreur de recup des encadreurs');
    //                         }else{
    //                             console.log(
    //                                 {
    //                                     resultat_demandes:results[i],
    //                                     listes_encadreurs:resul
    //                                 });
    //                         }
    //                     })
    //
    //                 }
    //                 else if(results[i].filiere ==='assistante de direction'){
    //                     connexion.query('SELECT nom, prenoms FROM pigier.professeur WHERE enseignement ="Assistante de direction"',(error,resul)=>{
    //                         if (error) {
    //                             console.log('erreur de recup des encadreurs');
    //                         }else{
    //                             console.log(
    //                                 {
    //                                     resultat_demandes:results[i],
    //                                     listes_encadreurs:resul
    //                                 });
    //                         }
    //                     })
    //
    //                 }
    //
    //             }
    //         }
    //     });
    // });




 //Route pour récupérer une demande par ID
 app.post('/demandesbyid', (req, res) => {
     const idEtudiant = req.body.idetudiant;


   //   const query = `
   //   SELECT donnetheme.iddonnetheme, etudiant.nom, etudiant.prenoms, donnetheme.annee_academique,
   //          donnetheme.classe, donnetheme.filiere, donnetheme.theme, donnetheme.objspecifique,
   //          donnetheme.objgeneral, donnetheme.problematique, donnetheme.environdevelop, donnetheme.statut
   //   FROM etudiant
   //   JOIN donnetheme ON donnetheme.idetudiant = etudiant.idetudiant
   //   WHERE donnetheme.idetudiant = ?
   // `;

     const query = 'CALL getAlldemandeByIdetudiant(?)';

     connexion.query(query, [idEtudiant], (error, results, fields) => {
         if (error) {
             console.error('Erreur lors de la récupération des demandes :', error);
             res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des demande.' });
             return;
         }

         // Initialisation d'un tableau pour stocker les habilitations
         let demandeArrayList = [];

         // Vérifier si results est défini et contient des données
         if (results && results.length > 0 && results[0] && results[0].length > 0) {
             results[0].forEach(result => {
                 let demande = {
                     iddonnetheme : result.iddonnetheme,
                     nom : result.nom,
                     prenoms : result.prenoms,
                     annee_academique : result.annee_academique,
                     classe : result.classe,
                     filiere : result.filiere,
                     theme : result.theme,
                     objspecifique : result.objspecifique,
                     objgeneral : result.objgeneral,
                     problematique : result.problematique,
                     environdevelop : result.environdevelop,
                     statut : result.statut
                 };
                 demandeArrayList.push(demande);
             });
         }

         res.json({ demandesid: demandeArrayList });
     });
 });

 // Effectuer une demande
// const app = express();
// const mysql = require('mysql');
// const bodyParser = require('body-parser');

app.use(bodyParser.json());

// const connexion = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'pigier'
// });

connexion.connect(error => {
    if (error) {
        console.error('Erreur de connexion à la base de données:', error);
        return;
    }
    console.log('Connecté à la base de données.');
});

app.post('/demandes', (req, res) => {
    const { contact, adress, annaca, cla,fil , thème, problé, objectspé, objectgé, result, env, id_etud } = req.body;


    const filieres = ['rgl', 'comptabilite', 'commerciale', 'ressource', 'assistante de direction'];

        if (filieres.includes(fil)) {
        const idfiliere = filieres.indexOf(fil) + 1;

        const query = 'INSERT INTO donnetheme (contact, email, annee_academique, classe, filiere, theme, objspecifique, objgeneral, problematique,resultat, environdevelop, statut, idetudiant, idfiliere) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "en cours", ?, ?)';
        const values = [contact, adress, annaca, cla,  fil, thème, objectspé, objectgé, problé, result,env, id_etud, idfiliere];

        connexion.query(query, values, (error, result) => {
            if (error) {
                res.json({ Erreur: 'Erreur de l\'ajout', error });
            } else {
                //
                res.json({ resultat: 'Données ajoutées avec succès' });
            }
        });
    } else {
        return res.status(400).json({ error: 'Invalid filiere' });
    }
});




// Les updates du statut refusé
// Les updates du statut refusé

// Les updates du statut valider
app.post('/statut-yes', (req, res) => {
    let idDemande = req.body.iddonnetheme;
    console.log(req.body.iddonnetheme);
    let requet = 'UPDATE donnetheme SET statut = "Valider" WHERE iddonnetheme = ?';

    connexion.query(requet, [idDemande], (err, result) => {
        if (err) {
            return res.json({ erreur: 'Erreur de statut', err });
        }

        connexion.query('SELECT email FROM donnetheme WHERE iddonnetheme = ?', [idDemande], (error, result) => {
            if (error) {
                return res.json({ resultat: 'Erreur de récupération du mail', error });
            }

            let transporter = nodemailer.createTransport({
                service: 'Outlook365',
                host: 'smtp-mail.outlook.com',
                port: 587,
                secure: false,
                auth: {
                    user: 'effossoukablan@outlook.com',
                    pass: '01Gosseyvan'
                }
            });

            // Choix de la date
            let day = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi","Dimanche"]
            let month = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin","Juillet","Aout", "Septembre", "Octobre", "Novembre", "Décembre"]
            let dat = new Date()
            dat.setDate(dat.getDate() + 3)

            let jr = dat.getDay()
            let jrs = dat.getDate()
            let moi = dat.getMonth() + 1
            let an = dat.getFullYear()


            let message =
                `<!DOCTYPE html><html lang="en">
                <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title>
                </head><style>body{display: flex;align-items: center;justify-content: center;}div{border-radius: 10px;width: 500px;display: flex;background-color: rgb(191, 213, 233);flex-direction: column;align-items: center;justify-content: center;}
                div p{color: black;font-weight: bold;}div .p1{color: black;font-size: 21px;text-decoration: underline;font-weight: bold;}div span{color: rgb(253, 0, 0);font-weight: bold;}
                .un{display: flex;flex-direction: column;align-items: center;justify-content: center}
                </style><body><div> <p class="p1">Demande de soutenance</p><div class="un"><p>Votre demande de soutenance est :</p><span>ACCEPTER</span> <p>Votre rendez-vous est pour le : ${day[jr]} ${jrs} ${month[moi]} ${an} </p>
                </div></div></body></html>`;


            let mailOptions = {
                from: 'SOUTENANCE PIGIER <effossoukablan@outlook.com>',
                to: result[0].email,
                subject: 'REPONSE DE LA DEMANDE',
                text: 'Accepté',
                html: message
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Erreur lors de l\'envoi de l\'email : ', error);
                    return res.json({ resultat: 'Email non envoyé', error });
                }

                console.log('Message envoyé: %s', info.messageId);
                return res.json({ resultat: 'Email envoyé' });
            });
        });
    });
});


app.post('/statut-no', (req, res) => {
    // const idEtudiant = "35"
    const  idDemande =  req.body.iddonnetheme
    // const motif = 'Dossiers pas un complet'
    const motif = req.body.motif;
    let requet = 'UPDATE donnetheme SET statut = "Refuse", motif = ? WHERE iddonnetheme = ?';
    connexion.query(requet, [ motif,idDemande], (err, result) => {
        if (err) {
            return res.json({ erreur: 'Erreur de statut', err });
        } else {
            connexion.query('SELECT email, motif FROM donnetheme WHERE iddonnetheme = ?', [idDemande], (errorr, result) => {
                if (errorr) {
                    console.log(errorr);
                    return res.json({ erreur: 'Erreur de récupération du mail', errorr});
                } else {

                    let transporter = nodemailer.createTransport({
                        service: 'Outlook365',
                        host: 'smtp-mail.outlook.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: 'effossoukablan@outlook.com',
                            pass: '01Gosseyvan'
                        }
                    });
                    console.log(result);
                    let message = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title></head><style>body{display: flex;align-items: center;justify-content: center;}div{border-radius: 10px;width: 500px;display: flex;background-color: rgb(191, 213, 233);flex-direction: column;align-items: center;justify-content: center;}div p{color: black;font-weight: bold;}div .p1{color: black;font-size: 21px;text-decoration: underline;font-weight: bold;}div span{color: rgb(253, 0, 0);font-weight: bold;}.un{display: flex;flex-direction: column;align-items: center;justify-content: center}</style><body><div> <p class="p1">Demande de soutenance</p><div class="un"><p>Votre demande de soutenance est :</p><span>REFUSE</span> <p>Pour motif suivant: ${result[0].motif}</p></div></div></body></html>`;
                    let mailOptions = {
                        from: 'SOUTENANCE PIGIER <effossoukablan@outlook.com>',
                        to: result[0].email,
                        subject: 'REPONSE DE LA DEMANDE',
                        text: 'Refusé',
                        html: message
                    }

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return res.json({ message: 'Email non envoyé', error });
                        }
                        return res.json({ resultat: 'Email de refus envoyé'});
                    });
                }
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

app.get('/filiere' ,(req,res)=>{
    connexion.query('SELECT  nomfiliere FROM pigier.filiere',(error,result)=>{
        if(error){
            console.log('erreur sur la requete ',error)
        }
        else {
            res.status(200).json((filiere=result))
        }
    })
})

app.post('/professeurs/filiere', (req, res) => {
    let filiere = req.body.filiere;

    if (filiere === 'rgl') {
        filiere = 'informatique';
    }

     if (filiere == 'comptabilite'){
        filiere='comptabilité'
    }
     if (filiere == 'commerciale'){
        filiere='Commerciale'
    }
     if (filiere == 'ressource'){
        filiere='Ressource Humaines'
    }
     if (filiere == 'assistante de direction'){
        filiere='Assistante de direction'
    }

    connexion.query(`SELECT idprofesseur, nom, prenoms FROM professeur WHERE enseignement = ?`, [filiere], (error, result) => {
        if (error) {
            console.log('Erreur lors de la récupération des professeurs', error);
            res.status(500).send('Erreur serveur');
        } else {
            res.json({ professeurs: result });
        }
    });
});

app.use('/etudiant', route);
app.use('/encadreur', route2);

app.listen(3001, () => {
    console.log(`Serveur démarré sur http://localhost:3001`);
});