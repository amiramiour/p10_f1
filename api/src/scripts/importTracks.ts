import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const API_KEY = process.env.F1_API_KEY; // clé de l'API Sports
const API_URL = 'https://v1.formula-1.api-sports.io/races?season=2023&type=Race';

async function importTracks() {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        'x-rapidapi-host': 'v1.formula-1.api-sports.io',
        'x-rapidapi-key': API_KEY || '',
      },
    });

    const races = response.data.response;
    const added = new Set<number>();
    let count = 0;

    for (const race of races) {
      const track = race.competition;

      if (!track || added.has(track.id)) continue;

      await prisma.track.upsert({
        where: { id_api_tracks: track.id },
        update: {},
        create: {
          id_api_tracks: track.id,
          country_name: track.location?.country || 'Unknown',
          track_name: track.name,
          picture_country: '', // à remplir à la main
          picture_track: '',   // idem
        },
      });

      added.add(track.id);
      count++;
    }

    console.log(`✅ ${count} circuits importés avec succès`);
  } catch (err) {
    console.error('❌ Erreur lors de l’import des circuits :', err);
  } finally {
    await prisma.$disconnect();
  }
}

importTracks();
