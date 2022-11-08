const multer = require('multer');

//Définition du dictionnaire des types MIME.
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

//Définition de la constante storage.
const storage = multer.diskStorage({ //On définit la constante storage comme étant un objet contenant deux fonctions (destination et filename).
    destination: (req, file, callback) => {
        callback(null, 'images'); //On indique à multer d'enregistrer les fichiers dans le dossier images.
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_'); //On remplace les espaces par des underscores.
        const extension = MIME_TYPES[file.mimetype]; //On récupère l'extension du fichier.
        const filename = name + Date.now() + '.' + extension; //On génère le nom du fichier.
        callback(null, filename); //On envoie le nom du fichier.
    }
});

//Exportation de la constante storage.
module.exports = multer({storage: storage}).single('image');