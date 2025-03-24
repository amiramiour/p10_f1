# Étape 1 : build image de base
FROM node:20.17-slim

# Crée le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers package.json et lock pour installer les deps en cache
COPY ../api/package*.json ./

# Installation des dépendances
RUN npm install

# Copie le reste du code source
COPY ../api .

# Expose le port d'Apollo Server (par défaut 4000)
EXPOSE 4000

# Commande pour lancer le serveur GraphQL
CMD ["npx", "ts-node", "app.ts"]
