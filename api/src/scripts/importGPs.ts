import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const API_URL = 'https://f1-api.demo.mds-paris.yt/api/date';
const BEARER_TOKEN = '2025';

async function importGPsFromProf() {
  try {
    await prisma.gP.deleteMany();
    console.log(' Table GP vidée');

    const { data: dates }: { data: { date: string }[] } = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });

    let addedCount = 0;

    for (const entry of dates) {
      const dateStr = entry.date;
      const dateObj = new Date(dateStr);

      // ID = timestamp pour éviter conflits
      const id_api_races = BigInt(dateObj.getTime());

      const existing = await prisma.gP.findUnique({
        where: { id_api_races },
      });

      if (!existing) {
        await prisma.gP.create({
          data: {
            id_api_races,
            season: '2025',
            date: dateObj,
            time: dateObj,
            id_api_tracks: 1, // temporaire, en attendant meilleur mapping
          },
        });
        console.log(` GP ajouté pour ${dateStr}`);
        addedCount++;
      }
    }

    console.log(`\n Import terminé : ${addedCount} GP ajoutés`);
  } catch (err) {
    console.error(' Erreur lors de l’import des GP depuis l’API du prof :', err);
  } finally {
    await prisma.$disconnect();
  }
}

importGPsFromProf();
