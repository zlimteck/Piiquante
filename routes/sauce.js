const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')
const limiter = require('../middleware/rate-limiter');

//Routes pour les sauces (création, modification, suppression, récupération d'une sauce, récupération de toutes les sauces et like ou dislike d'une sauce).
router.post('/', auth, limiter, multer, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/:id/like', auth, limiter, sauceCtrl.likeSauce);
router.put('/:id', auth, limiter, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, limiter, sauceCtrl.deleteSauce);

//Exportation du router.
module.exports = router;