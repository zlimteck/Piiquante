require ('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const mongobdSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const path = require('path');
const app = express();
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

//Connexion a mongodb.
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_LINK}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//Securisation des en-tetes http.
app.use(helmet({
    crossOriginResourcePolicy: false
}));

//Parametrage du CORS.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //Autorise l'acces a l'API depuis n'importe quelle origine.
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //Autorise l'acces a l'API avec les en-tetes indiqués.
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //Autorise l'utilisation des methodes indiquées.
    next();
});

//Parser les objet json.
app.use(express.json());

//Evite l'injection de code dans la base de données.
app.use(mongobdSanitize());

//Routes.
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

//cree un dossier images si il n'existe pas.
const fs = require('fs');
const dir = './images'; //On definit le chemin du dossier.
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
} //Si le dossier n'existe pas, on le crée.

//Exportation de l'application.
module.exports = app;