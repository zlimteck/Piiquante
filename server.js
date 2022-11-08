const http = require('http');
const app = require('./app');
require('dotenv').config();

// Configuration du port.
const normalizePort = val => {
    const port = parseInt(val, 10); 
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0){
        return port;
    }
    return false;
}; 

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port); 

//Erreur lié au port.
const errorHandler = error => {
    if (error.syscal !== 'listen') {
        throw error;
    } //On recherche les différentes erreurs et on les gère de manière appropriée.
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    switch (error.code){
        case 'EACCES':
            console.error(bind + 'is requires elevated privileges.');
            process.exit(1);
            break; //On renvoie une erreur si ont n'a pas les droits.
        case 'EADDRINUSE':
            console.error(bind + 'is already in use.');
            process.exit(1);
            break; //On renvoie une erreur si le port est déjà utilisé.
        default:
            throw error;
    }
};

//Creation du serveur.
const server = http.createServer(app);
server.on('error', errorHandler); //On écoute les erreurs.
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port; 
    console.log('Listening on ' + bind); 
});

//Ecoute du port.
server.listen(port);