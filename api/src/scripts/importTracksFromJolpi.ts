import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

const API_URL = 'https://api.jolpi.ca/ergast/f1/2025.json';

export async function importTracksFromJolpi() {
  try {
    const response = await axios.get(API_URL);
    const races = response.data.MRData.RaceTable.Races;

    const uniqueCircuits = new Map<string, { name: string; country: string }>();
    let count = 0;

    for (const race of races) {
      const circuit = race.Circuit;
      const circuitId = circuit?.circuitId;
      const circuitName = circuit?.circuitName;
      const country = circuit?.Location?.country || 'Unknown';

      if (!circuitId || !circuitName) continue;
      if (uniqueCircuits.has(circuitId)) continue;

      uniqueCircuits.set(circuitId, { name: circuitName, country });
    }

    for (const [circuitId, data] of uniqueCircuits.entries()) {
      // Générer un ID numérique stable à partir de circuitId (hash + slice)
      const id = parseInt(crypto.createHash('md5').update(circuitId).digest('hex').slice(0, 8), 16);

      await prisma.track.upsert({
        where: { id_api_tracks: id },
        update: {},
        create: {
          id_api_tracks: id,
          track_name: data.name,
          country_name: data.country,
          picture_country: '',
          picture_track: '',
        },
      });

      count++;
      console.log(` Circuit importé : ${data.name} (${data.country})`);
    }

    console.log(`\n ${count} circuits importés avec succès depuis Jolpi.`);
  } catch (err) {
    console.error(' Erreur lors de l’import des circuits depuis Jolpi :', err);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  importTracksFromJolpi();
}
