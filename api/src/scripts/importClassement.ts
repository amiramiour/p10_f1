import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const API_URL = 'https://f1-api.demo.mds-paris.yt/api/last';
const BEARER_TOKEN = '2025';

async function importClassements() {
  console.log('📡 Récupération des résultats depuis l’API du prof...');

  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });

    const results = response.data;
    if (!Array.isArray(results) || results.length === 0) {
      console.log(' Aucun résultat à importer.');
      return;
    }

    const scrapedAt = new Date(results[0].scraped_at);

    const dayStart = new Date(scrapedAt);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(scrapedAt);
    dayEnd.setHours(23, 59, 59, 999);

    const existingGP = await prisma.gP.findFirst({
      where: {
        date: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
    });

    if (!existingGP) {
      console.log(' Aucun GP trouvé à cette date :', scrapedAt.toISOString());
      return;
    }

    let insertCount = 0;
    for (const result of results) {
      const pilote = await prisma.pilote.findUnique({ where: { driver_number: parseInt(result.number) } });

      if (!pilote) {
        console.log(` Pilote introuvable pour numéro ${result.number}`);
        continue;
      }

      const gpp = await prisma.gPP.findFirst({
        where: {
          id_gp: existingGP.id_api_races,
          id_pilote: pilote.id_api_pilotes,
        },
      });

      if (!gpp) {
        console.log(` GPP introuvable pour pilote ${pilote.name}, skip.`);
        continue;
      }

      await prisma.gPClassement.create({
        data: {
          id_gp: existingGP.id_api_races,
          id_gp_pilote: gpp.id,
          position: parseInt(result.position),
          isDNF: false,
        },
      });

      insertCount++;
    }

    console.log(` ${insertCount} résultats GP insérés pour le GP du ${scrapedAt.toISOString().split('T')[0]}`);
  } catch (error: any) {
    console.error(' Erreur lors de l’import des classements :', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

importClassements();
