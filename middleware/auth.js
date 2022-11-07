require('dotenv').config();
const jwt = require('jsonwebtoken');

//middleware pour vérifier si l'utilisateur est authentifié. Si oui, il passe à la suite. Si non, il renvoie une erreur 401.
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; //On récupère le token dans le header de la requête.
        const decodedToken = jwt.verify(token, process.env.TOKEN_KEY); //On décode le token.
        const userId = decodedToken.userId; //On récupère l'id de l'utilisateur.
        req.auth ={
            userId: userId
        }; //On ajoute l'id de l'utilisateur à la requête.
        next();
    } catch(error) {
        res.status(401).json({error: error | 'Requête non authentifiée'});
    }
};