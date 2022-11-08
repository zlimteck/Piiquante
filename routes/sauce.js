const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

//Routes pour les sauces (création, modification, suppression, récupération d'une sauce, récupération de toutes les sauces et like ou dislike d'une sauce).
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);

//Exportation du router.
module.exports = router;