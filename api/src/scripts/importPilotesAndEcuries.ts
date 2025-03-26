import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

async function importPilotesAndEcuries() {
  try {
    const { data: drivers } = await axios.get('https://api.openf1.org/v1/drivers');

    const ecurieMap = new Map<string, number>(); // team_name => id
    const currentYear = new Date().getFullYear();

    for (const driver of drivers) {
      const {
        driver_number,
        full_name,
        headshot_url,
        name_acronym,
        team_name,
        team_colour,
      } = driver;

      if (!driver_number || !full_name || !team_name) continue;

      const piloteId = parseInt(driver_number);

      //  Étape 1 : upsert l’écurie
      let ecurie = await prisma.ecurie.findFirst({
        where: { name: team_name },
      });

      if (!ecurie) {
        ecurie = await prisma.ecurie.create({
          data: {
            name: team_name,
            logo: '', // à remplir plus tard manuellement
            color: team_colour || '',
          },
        });
      }

      ecurieMap.set(team_name, ecurie.id_api_ecuries);

      //  Étape 2 : upsert le pilote (si pas déjà existant)
      let pilote = await prisma.pilote.findUnique({
        where: { id_api_pilotes: piloteId },
      });

      if (!pilote) {
        pilote = await prisma.pilote.create({
          data: {
            id_api_pilotes: piloteId,
            name: full_name,
            picture: headshot_url || '',
            name_acronym: name_acronym || '',
          },
        });
      }

      //  Étape 3 : créer la relation PiloteEcurie
      const existingRelation = await prisma.piloteEcurie.findFirst({
        where: {
          id_pilote: pilote.id_api_pilotes,
          id_ecurie: ecurie.id_api_ecuries,
          year: new Date(`${currentYear}-01-01`),
        },
      });

      if (!existingRelation) {
        await prisma.piloteEcurie.create({
          data: {
            id_pilote: pilote.id_api_pilotes,
            id_ecurie: ecurie.id_api_ecuries,
            year: new Date(`${currentYear}-01-01`),
          },
        });
      }
    }

    console.log(' Import pilotes + écuries terminé avec succès');
  } catch (err) {
    console.error(' Erreur pendant l’import:', err);
  } finally {
    await prisma.$disconnect();
  }
}

importPilotesAndEcuries();
