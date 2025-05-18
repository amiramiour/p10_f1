import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = 'https://f1-api.demo.mds-paris.yt/api/gp/dates';
const BEARER_TOKEN = '2025';

async function importUpcomingGPs() {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });

    const dates: { date: string }[] = response.data;
    let count = 0;

    for (const { date } of dates) {
      const dateObj = new Date(date);
      const timestamp = dateObj.getTime();

      // Vérifie si déjà présent
      const exists = await prisma.gP.findUnique({
        where: { id_api_races: BigInt(timestamp) },
      });

      if (!exists) {
        await prisma.gP.create({
          data: {
            id_api_races: BigInt(timestamp),
            season: '2025',
            date: dateObj,
            time: new Date(date + 'T00:00:00Z'),
            id_api_tracks: 1, // temporairement, on met 1 en attendant mieux
          },
        });
        count++;
        console.log(` GP à venir ajouté : ${date}`);
      }
    }

    console.log(`\n Import terminé : ${count} nouveaux GP à venir ajoutés.`);
  } catch (err) {
    console.error(' Erreur lors de l’import des GP à venir :', err);
  } finally {
    await prisma.$disconnect();
  }
}

importUpcomingGPs();
