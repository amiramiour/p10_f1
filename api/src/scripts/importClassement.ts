import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const API_URL = 'https://f1-api.demo.mds-paris.yt/api/gp/latest';
const BEARER_TOKEN = '2025';

export async function importClassement() {
  console.log(' Récupération des résultats depuis l’API du prof...');

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

    // Décalage : scraped_at = date du GP +1 jour
    const scrapedAt = new Date(results[0].scraped_at);
    const gpDate = new Date(scrapedAt);
    gpDate.setDate(gpDate.getDate() - 1);
    gpDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(gpDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const existingGP = await prisma.gP.findFirst({
      where: {
        date: {
          gte: gpDate,
          lt: nextDay,
        },
      },
    });

    if (!existingGP) {
      console.log(' Aucun GP trouvé pour la date correspondante :', gpDate.toISOString().split('T')[0]);
      return;
    }

    let insertCount = 0;

    for (const result of results) {
      const driverNumber = parseInt(result.number);
      const position = parseInt(result.position);

      if (isNaN(driverNumber) || isNaN(position)) {
        console.warn(` Infos invalides pour un pilote : numéro=${result.number}, position=${result.position}`);
        continue;
      }

      const pilote = await prisma.pilote.findUnique({
        where: { driver_number: driverNumber },
      });

      if (!pilote) {
        console.warn(` Pilote introuvable pour numéro ${result.number}`);
        continue;
      }

      const gpp = await prisma.gPP.findFirst({
        where: {
          id_gp: existingGP.id_api_races,
          id_pilote: pilote.id_api_pilotes,
        },
      });

      if (!gpp) {
        console.warn(` GPP introuvable pour ${pilote.name}, skip.`);
        continue;
      }

      const alreadyExists = await prisma.gPClassement.findFirst({
        where: {
          id_gp: existingGP.id_api_races,
          id_gp_pilote: gpp.id,
        },
      });

      if (alreadyExists) {
        console.log(` Classement déjà présent pour ${pilote.name}, skip.`);
        continue;
      }

      await prisma.gPClassement.create({
        data: {
          id_gp: existingGP.id_api_races,
          id_gp_pilote: gpp.id,
          position,
          isDNF: false,
        },
      });

      insertCount++;
    }

    console.log(` ${insertCount} résultats insérés pour le GP du ${existingGP.date.toISOString().split('T')[0]}`);
  } catch (error: any) {
    console.error(' Erreur lors de l’import :', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  importClassement();
}
