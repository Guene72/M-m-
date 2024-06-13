const {route, route2} = require('./routes/routes.js');


// const encadroute = require('./routes/routes.js');
const express=require('express')
const cors = require('cors');
const mysql = require('mysql2');
const sessions = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

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
                message: 'Connexion réussie en tant qu\'étudiant',
                user: {
                    username: user.username,
                    password: user.password
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
                            username: user.username,
                            password: user.password
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
app.post('/demandes', (req, res) => {
    // let nom = 'Gaoussou';
    // let prenoms = 'fiero';
    // let datenaiss = '2022-10-25';
    // let username = 'Nfk';
    // let password = '123456';
    // let filiere = 'commerciale';
    // let themeSoutenance = 'Gestion d\'un magasin';


    const { nom, prenoms, annaca, filiere, classe,themesoutenance } = req.body;
    const filieres = ['rgl', 'comptabilite', 'commerciale', 'ressource', 'assistante de direction'];



    if (filieres.includes(filiere)) {
        const query = 'INSERT INTO etudiant (nom, prenoms, annaca, filiere, classe,themesoutenance) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [nom, prenoms, annaca, filiere, classe,themesoutenance];

        connexion.query(query, values, (error, result) => {
            if (error) {
                console.log('Erreur d\'ajout de la demande', error);
                return res.status(500).json({ error: 'Erreur de requête à la base de données' });
            } else {
                const demande = { nom, prenoms, annaca, filiere, classe, themesoutenance };
                return res.json({ message: 'demande ok' ,demande});
            }
        });
    } else {
        return res.status(400).json({ error: 'Filière invalide' });
    }
});


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

app.use('/etudiant', route);
app.use('/encadreur', route2);

app.listen(3001, () => {
    console.log(`Serveur démarré sur http://localhost:3001`);
});