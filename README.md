# PIIQUANTE

## Présentation

PIIQUANTE est une API de sauces piquantes. Elle permet de créer des sauces piquantes, de les liker ou de les disliker, de les modifier ou de les supprimer. Elle permet également de créer un compte utilisateur et de se connecter à celui-ci.

## Installation

### Prérequis

- Node.js
- NPM
- MongoDB
- Express
- Nodemon (optionnel)

### Lancer le serveur front-end
1. Cloner le [Repository](https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6)

2. Dans un terminal, se placer dans le dossier et exécuter la commande suivante:

``` npm install ```

3. Lancer le serveur:

``` npm start ```

### Lancer le serveur back-end
1. Dans un terminal, se placer dans le dossier et exécuter la commande suivante:

``` npm install```

2. ajouter les variables d'environnement dans le fichier .env.exemple et renommer le fichier en .env:

``` PORT=3000 ```

``` DB_USER= ```

``` DB_PASSWORD= ```

``` DB_LINK= ```

``` TOKEN_KEY= ```

3. Lancer le serveur:

``` node server.js ``` ou ``` nodemon server.js ```

### Informations a mettre dans le fichier .env (Pour les examinateurs)

```
PORT = 3000 # Port par defaut

#DATABASE.
DB_USER= piiquente # Nom d'utilisateur de la base de données
DB_PASSWORD= ywcZVDumyvuDXSnU # Mot de passe de la base de données
DB_LINK= cluster0.xcwxmmx.mongodb.net/ # Lien de la base de données

#JWT.
TOKEN_KEY= 6b6c6d6e6f # Clé secrète pour la génération du token
```