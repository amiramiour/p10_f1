import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const API_PROF_URL = 'https://f1-api.demo.mds-paris.yt/api/gp/dates';
const BEARER_TOKEN = '2025';

const API_SPORTS_URL = 'https://v1.formula-1.api-sports.io/races';
const SEASON = '2025';
const API_KEY = process.env.F1_API_KEY; // Assure-toi que c’est bien défini

export async function importUpcomingGPsFromApiSports() {
  try {
    // 1. Dates officielles depuis l'API du prof
    const { data: profDates } = await axios.get(API_PROF_URL, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });

    // 2. Infos courses depuis API-Sports
    const { data } = await axios.get(API_SPORTS_URL, {
      headers: {
        'x-rapidapi-host': 'v1.formula-1.api-sports.io',
        'x-rapidapi-key': API_KEY ?? '',
      },
      params: {
        season: SEASON,
        type: 'Race',
      },
    });

    const races = data.response;
    let count = 0;

    for (const { date } of profDates) {
      const dateObj = new Date(date);
      const timestamp = dateObj.getTime();

      // Vérifie si le GP existe déjà
      const exists = await prisma.gP.findUnique({
        where: { id_api_races: BigInt(timestamp) },
      });
      if (exists) continue;

      // Trouver la course dans API-Sports proche de la date
      const matchingRace = races.find((race: any) => {
        const raceDate = new Date(race.date);
        const diffInDays = Math.abs((raceDate.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
        return diffInDays <= 2;
      });

      if (!matchingRace) {
        console.warn(` Aucun GP trouvé côté API-Sports pour la date : ${date}`);
        continue;
      }

      const circuitId = matchingRace.circuit?.id;
      const raceName = matchingRace.competition?.name;

      if (!circuitId) {
        console.warn(` Course sans circuit ID pour : ${raceName}`);
        continue;
      }

      // Cherche le circuit dans la BDD
      const track = await prisma.track.findUnique({
        where: { id_api_tracks: circuitId },
      });

      if (!track) {
        console.warn(` Circuit ID ${circuitId} non trouvé en BDD`);
        continue;
      }

      await prisma.gP.create({
        data: {
          id_api_races: BigInt(timestamp),
          season: SEASON,
          date: dateObj,
          time: new Date(date + 'T00:00:00Z'),
          id_api_tracks: track.id_api_tracks,
        },
      });

      console.log(` GP ajouté : ${date} → ${track.track_name}`);
      count++;
    }

    console.log(`\n Import terminé : ${count} nouveaux GP ajoutés avec succès.`);
  } catch (err) {
    console.error(' Erreur lors de l’import :', err);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  importUpcomingGPsFromApiSports();
}
