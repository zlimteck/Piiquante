const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const passwordValidator = require('../middleware/password-validator');
const regexMail = require('../middleware/regex-mail');

//Routes pour les utilisateurs (inscription et connexion).
router.post('/signup', regexMail, passwordValidator, userCtrl.signup); 
router.post('/login', userCtrl.login); 

//Exportation du router.
module.exports = router;