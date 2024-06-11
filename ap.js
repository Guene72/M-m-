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


app.get('/demandes',(req, res)=>{
  // Effectuer une demandes

  let nom = 'Gaoussou'
  let prenoms = 'fiero'
  let datenaiss = '2022-10-25'
  let username = 'Nfk'
  let password = '123456'
  let filiere = 'RGL'
  let themeSoutenance = 'Gestion d\'un magasin'
  const query2 = 'INSERT INTO filiere (nomfiliere) VALUES (?)';
  const value2 = [filiere]

  connexion.query(query2, value2, (error, result)=>{
    if (error) {
      console.log('Erreur d\'ajout dans la base de donnée', error);
    }else{
      const idEt = result.insertId ;
      const query1 = 'INSERT INTO etudiant (nom, prenoms, datenaiss, username, password, themesoutenance, idfiliere ) VALUES (?, ?, ?, ?, ?, ?, ?)'
      const value1 = [nom, prenoms, datenaiss, username, password, themeSoutenance, idEt]
      connexion.query(query1, value1, (error, result)=>{
        if (error) {
          console.log('Erreur d\'ajout de la demande', error);
        }else
        res.json({resultat: result})
      })
    }
  })
})

app.use('/etudiant', route);
app.use('/encadreur', route2);

app.listen(3001, () => {
    console.log(`Serveur démarré sur http://localhost:3001`);
});
