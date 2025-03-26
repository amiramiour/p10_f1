import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const API_KEY = process.env.F1_API_KEY as string;

async function importGPs() {
  try {
    const response = await axios.get('https://v1.formula-1.api-sports.io/races', {
      params: {
        season: 2023,
        type: 'Race',
      },
      headers: {
        'x-apisports-key': API_KEY,
      },
    });

    const races = response.data.response;

    for (const race of races) {
      await prisma.gP.upsert({
        where: { id_api_races: race.id },
        update: {},
        create: {
          id_api_races: race.id,
          season: String(race.season),
          date: new Date(race.date),
          time: race.time ? new Date(`${race.date}T${race.time}`) : new Date(race.date),
          id_api_tracks: race.circuit.id,
        },
      });
    }

    console.log(` ${races.length} GP imported with success`);
  } catch (error) {
    console.error(' Failed to import GPs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importGPs();
