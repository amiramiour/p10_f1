import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const API_KEY = process.env.F1_API_KEY; 
const API_URL = 'https://v1.formula-1.api-sports.io/circuits';

export async function importTracks() {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        'x-rapidapi-host': 'v1.formula-1.api-sports.io',
        'x-rapidapi-key': API_KEY || '',
      },
    });

    const circuits = response.data.response;

    const added = new Set<number>();
    let count = 0;

    for (const circuit of circuits) {
      const id = circuit.id;
      const name = circuit.name;
      const country = circuit.location?.country || 'Unknown';

      if (added.has(id)) continue;

      await prisma.track.upsert({
        where: { id_api_tracks: id },
        update: {},
        create: {
          id_api_tracks: id,
          track_name: name,
          country_name: country,
          picture_country: '', // à compléter à la main
          picture_track: '',   // à compléter à la main
        },
      });

      added.add(id);
      count++;
    }

    console.log(` ${count} circuits importés avec succès`);
  } catch (err) {
    console.error(' Erreur lors de l’import des circuits :', err);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  importTracks();
}
