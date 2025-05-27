#!/bin/sh
npx prisma migrate deploy --schema=src/prisma/schema.prisma
npx prisma generate --schema=src/prisma/schema.prisma

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

npx ts-node app.ts