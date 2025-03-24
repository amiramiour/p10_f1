# Étape 1 : image de base
FROM node:20.17-slim

# Dossier de travail dans le conteneur
WORKDIR /app

# Copie package.json / lock en premier (meilleure gestion du cache)
COPY ../api/package*.json ./

# Install des dépendances
RUN npm install

# Installe OpenSSL (pour Prisma)
RUN apt-get update -y && apt-get install -y openssl

# Copie le reste du code source
COPY ../api .

# Génère Prisma (maintenant que le schema est là)
RUN npx prisma generate --schema=src/prisma/schema.prisma

# Port exposé
EXPOSE 4000

# Commande de démarrage
CMD ["npx", "ts-node", "app.ts"]
