const Sauce = require('../models/Sauce');
const fs = require('fs');

//Création d'une nouvelle sauce.
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); //On extrait l'objet sauce du corps de la requête.
    delete sauceObject._id; //On supprime l'id généré automatiquement et envoyé par le frontend.
    delete sauceObject._userId; //On supprime l'id de l'utilisateur généré automatiquement et envoyé par le frontend.
    const sauce = new Sauce({ //On crée une nouvelle instance de sauce.
        ...sauceObject, //On récupère les données du corps de la requête.
        userId : req.auth.userId, //On récupère l'id de l'utilisateur.
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, //On génère l'url de l'image.
        likes: 0, //On initialise le nombre de likes à 0.
        dislikes: 0, //On initialise le nombre de dislikes à 0.
        usersLiked: [], //On initialise le tableau des utilisateurs ayant liké à vide.
        usersDisliked: [] //On initialise le tableau des utilisateurs ayant disliké à vide.
    });
    sauce.save() //On enregistre la sauce dans la base de données.
    .then(() => res.status(201).json({message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({error}));
    console.log(`Nouvelle sauce ${sauceObject.name} enregistrée par ${req.auth.userId} !`);  //Console log avec la sauce créée et lútilisateur qui la crée
};

//Modification d'une sauce.
exports.modifySauce = (req, res, next) => {
};

//Suppression d'une sauce.
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}) //On récupère la sauce correspondant à l'id.
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1]; //On récupère le nom du fichier.
        fs.unlink(`images/${filename}`,() => { //On supprime le fichier.
            Sauce.deleteOne({_id: req.params.id}) //On supprime la sauce correspondant à l'id.
            .then(() => res.status(200).json({message: 'Sauce supprimé !'}))
            .catch(error => res.status(400).json({error}));
            console.log(`Sauce ${sauce.name} supprimée par ${req.auth.userId} !`); //Console log avec la sauce supprimée et l'utilisateur qui la supprime.
        });
    })
    .catch(error => res.status(500).json({error}));
};

//Récupération d'une sauce.
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}) //On récupère la sauce correspondant à l'id.
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
};

//Récupération de toutes les sauces.
exports.getAllSauces = (req, res, next) => {
    Sauce.find() //On récupère toutes les sauces.
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
};

//Like ou dislike d'une sauce.
exports.likeSauce = (req, res, next) => {
};