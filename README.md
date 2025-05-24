#  F1 P10 Betting App — Backend

> Plateforme de paris axée sur la Formule 1. Les utilisateurs créent ou rejoignent des ligues, parient sur le pilote qui terminera 10e (P10) et le premier à abandonner (DNF), avec calcul automatique des points.

---

##  Fonctionnalités principales

-  Authentification sécurisée (JWT, mots de passe hashés)
-  Gestion des utilisateurs (création, login, update, delete)
-  Création et gestion de ligues publiques/privées
-  Import automatique des données GP / pilotes / écuries / circuits
-  Système de paris sur :
  -  le pilote en P10
  -  le premier à abandonner (DNF)
-  Calcul automatique des points selon un barème
-  API GraphQL complète (requêtes & mutations)
-  Architecture modulaire avec Prisma & PostgreSQL

##  Stack technique

- **Langage** : TypeScript
- **Backend** : Node.js + Apollo Server (GraphQL)
- **ORM** : Prisma
- **Base de données** : PostgreSQL
- **Sécurité** : JWT, Argon2 (hash mot de passe)
- **Récupération données F1** : API externe (OpenF1-like)
- **Docker** : Configuration complète incluse

---

##  Installation

### 1. Cloner le repo
git clone https://github.com/tonpseudo/f1-p10-backend.git
cd f1-p10-backend
### 2. Configurer les variables d'environnement
Créer un fichier .env dans le dossier racine :
    DATABASE_URL=postgresql://user:password@localhost:5432/nom_db
    JWT_SECRET=ton_secret
### 3. Lancer en local (via Docker)
docker-compose up --build

### 4. Prisma

# a. Installer les dépendances
npm install

# b. Générer le client Prisma
npx prisma generate --schema=src/prisma/schema.prisma

# c. Synchroniser le schéma avec la DB
npx dotenv -e .env -- prisma db push --schema=src/prisma/schema.prisma

##  Import de données (scripts)

# Charger circuits
npx ts-node --require ./src/scripts/load-env.ts ./src/scripts/importTracksFromJolpi.ts

# Charger pilotes et écuries
npx ts-node --require ./src/scripts/load-env.ts ./src/scripts/importPilotesAndEcuries.ts

# Charger GPs à venir
npx ts-node --require ./src/scripts/load-env.ts ./src/scripts/importUpcomingGPsFromJolpi.ts

# Générer GPP (relation GP-pilote)
npx ts-node --require ./src/scripts/load-env.ts ./src/scripts/generateGPP.ts

# Importer les classements
npx ts-node --require ./src/scripts/load-env.ts ./src/scripts/importClassement.ts

# Calculer les points
npx ts-node --require ./src/scripts/load-env.ts ./src/scripts/calculatePoints.ts

##  Authentification

JWT envoyé via header :
Authorization:  <token>

## Tests de l'API

Utiliser GraphQL Playground (http://localhost:4000 si local) pour tester :
Exemple de mutation :

    mutation {
    createUser(
        email: "lewis@mercedes.com",
        firstname: "Lewis",
        lastname: "Hamilton",
        password: "secretpass"
    ) {
        id
        email
    }
    }
