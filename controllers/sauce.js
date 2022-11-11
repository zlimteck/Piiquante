const Sauce = require('../models/Sauce');
const fs = require('fs');

//Création d'une nouvelle sauce.
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId; //Suppression de l'id de l'utilisateur et de l'objet _id
    const sauce = new Sauce({ 
        ...sauceObject, 
        userId : req.auth.userId, //On récupère l'id de l'utilisateur.
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, //On génère l'url de l'image.
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save() 
    .then(() => res.status(201).json({message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({error}));
    //console.log(`Nouvelle sauce ${sauceObject.name} enregistrée par ${req.auth.userId} !`);
};

//Modification d'une sauce.
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? //On vérifie si une image est présente dans la requête.
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //On génère l'url de l'image.
    } : {...req.body}; //On extrait l'objet sauce du corps de la requête.
    delete sauceObject._userId; //On supprime l'id de l'utilisateur généré automatiquement et envoyé par le frontend.
    Sauce.findOne({_id: req.params.id}) //On récupère la sauce correspondant à l'id.
    .then(sauce => {
        //On vérifie si l'utilisateur est le propriétaire de la sauce.
        if (sauce.userId != req.auth.userId) {
            return res.status(403).json({message: 'Vous n\'êtes pas autorisé à modifier cette sauce !'});
        } else {
            const filename = sauce.imageUrl.split('/images/')[1];
            // Si ont modifie l'image, on supprime l'ancienne image.
            if (req.file) {
                fs.unlink(`images/${filename}`, () => {
                    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                    .then(() => res.status(200).json({message: 'Sauce modifiée !'}))
                    .catch(error => res.status(401).json({error})); 
                });
            } else {
                //Si on ne modifie pas l'image, on ne supprime pas l'ancienne image.
                Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message: 'Sauce modifiée !'}))
                .catch(error => res.status(401).json({error})); 
            }
        }
    })
    .catch(error => res.status(500).json({error})); //Si la sauce n'existe pas, on renvoie une erreur 500.
};

//Suppression d'une sauce.
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}) //On récupère la sauce correspondant à l'id.
    .then(sauce => {
        //Si l'utilisateur qui supprime la sauce est le même que celui qui l'a créée.
        if(sauce.userId != req.auth.userId) {
            return res.status(403).json({error: 'Vous n\'êtes pas autorisé à supprimer cette sauce !'});
        } else {
            const filename = sauce.imageUrl.split('/images/')[1]; //On récupère le nom du fichier.
            fs.unlink(`images/${filename}`,() => { //On supprime le fichier.
                Sauce.deleteOne({_id: req.params.id}) //On supprime la sauce correspondant à l'id.
                .then(() => res.status(200).json({message: 'Sauce supprimé !'})) //On renvoie un message de confirmation.
                .catch(error => res.status(400).json({error})); //On renvoie une erreur si la suppression échoue.
                console.log(`Sauce ${sauce.name} supprimée par ${req.auth.userId} !`); //Console log avec la sauce supprimée et l'utilisateur qui la supprime.
            });
        }
    })
    .catch(error => res.status(500).json({error})); //Si la sauce n'existe pas, on renvoie une erreur 500.
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
    const like = req.body.like;
    const userId = req.body.userId;
    const sauceId = req.params.id;
    Sauce.findOne({_id: sauceId}) //On récupère la sauce correspondant à l'id.
    .then(sauce => {
        if (like === 1) { //Si l'utilisateur like la sauce.
            Sauce.updateOne({_id: sauceId}, {$inc: {likes: 1}, $push: {usersLiked: userId}, _id: sauceId})
            .then(() => res.status(200).json({message: 'Like ajouté !'}))
            .catch(error => res.status(400).json({error}));
            console.log(`Sauce ${sauce.name} likée par ${req.auth.userId} !`);
        } else if (like === -1) { //Si l'utilisateur dislike la sauce.
            Sauce.updateOne({_id: sauceId}, {$inc: {dislikes: 1}, $push: {usersDisliked: userId}, _id: sauceId})
            .then(() => res.status(200).json ({message: 'Dislike ajouté !'}))
            .catch(error => res.status(400).json ({error}));
            console.log(`Sauce ${sauce.name} dislikée par ${req.auth.userId} !`);
        } else if (like === 0) { //Si l'utilisateur annule son like.
            if (sauce.usersLiked.includes(userId)) {
                Sauce.updateOne({_id: sauceId}, {$inc: {likes: -1}, $pull: {usersLiked: userId}, _id: sauceId})
                .then(() => res.status(200).json({message: 'Like retirée !'}))
                .catch(error => res.status(400).json({error}));
                console.log(`like retiré de la sauce ${sauce.name} par ${req.auth.userId} !`);
            } else if (sauce.usersDisliked.includes(userId)) { //Si l'utilisateur annule son dislike.
                Sauce.updateOne({_id: sauceId}, {$inc: {dislikes: -1}, $pull: {usersDisliked: userId}, _id: sauceId})
                .then(() => res.status(200).json({message: 'Dislike retiré !'}))
                .catch(error => res.status(400).json({error}));
                console.log(`Dislike retiré de la sauce ${sauce.name} par ${req.auth.userId} !`);
            }
        }
    })
    .catch(error => res.status(404).json({error})); //Si la sauce n'existe pas, on renvoie une erreur 404.
};