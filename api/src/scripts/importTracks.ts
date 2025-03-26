import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const API_KEY = process.env.F1_API_KEY as string;

async function importTracks() {
  try {
    const { data } = await axios.get('https://v1.formula-1.api-sports.io/races', {
      params: {
        season: 2023,
        type: 'Race',
      },
      headers: {
        'x-apisports-key': API_KEY,
      },
    });

    const races = data.response;

    const uniqueTracks = new Map();

    for (const race of races) {
      const circuit = race.circuit;

      // Pour éviter les doublons
      if (!uniqueTracks.has(circuit.id)) {
        uniqueTracks.set(circuit.id, circuit);
      }
    }

    for (const [id, track] of uniqueTracks) {
      await prisma.track.upsert({
        where: { id_api_tracks: id },
        update: {},
        create: {
          id_api_tracks: id,
          country_name: track.location?.country || 'Unknown',
          track_name: track.name,
          picture_country: '', //  À compléter manuellement plus tard
          picture_track: '',   //  Idem
        },
      });
    }

    console.log(` ${uniqueTracks.size} tracks imported with success`);
  } catch (err) {
    console.error(' Error importing tracks:', err);
  } finally {
    await prisma.$disconnect();
  }
}

importTracks();
