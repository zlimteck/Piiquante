const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Création du schéma utilisateur.
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

//Ajout du plugin uniqueValidator au schéma utilisateur pour éviter les doublons.
userSchema.plugin(uniqueValidator);

//Exportation du schéma utilisateur.
module.exports = mongoose.model('User', userSchema);