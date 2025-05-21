import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const API_URL = 'https://api.jolpi.ca/ergast/f1/2025.json';
const SEASON = '2025';

export async function importUpcomingGPsFromJolpi() {
  try {
    const response = await axios.get(API_URL);
    const races = response.data.MRData.RaceTable.Races;

    let count = 0;

    for (const race of races) {
      const raceDate = new Date(race.date);
      const timestamp = raceDate.getTime();
      const circuitName = race.Circuit?.circuitName;

      if (!circuitName) {
        console.warn(` Aucun nom de circuit pour le GP "${race.raceName}"`);
        continue;
      }

      // Vérifie si le GP existe déjà
      const exists = await prisma.gP.findUnique({
        where: { id_api_races: BigInt(timestamp) },
      });

      if (exists) continue;

      // Chercher le circuit correspondant dans la BDD
      const track = await prisma.track.findFirst({
        where: {
          track_name: {
            contains: circuitName,
            mode: 'insensitive',
          },
        },
      });

      if (!track) {
        console.warn(` Circuit non trouvé : "${circuitName}"`);
        continue;
      }

      // Créer le GP
      await prisma.gP.create({
        data: {
          id_api_races: BigInt(timestamp),
          season: SEASON,
          date: raceDate,
          time: new Date(race.date + 'T00:00:00Z'),
          id_api_tracks: track.id_api_tracks,
        },
      });

      console.log(` GP ajouté : ${race.raceName} → ${track.track_name}`);
      count++;
    }

    console.log(`\n Import terminé : ${count} nouveaux GP ajoutés.`);
  } catch (err) {
    console.error(' Erreur lors de l’import depuis Jolpi :', err);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  importUpcomingGPsFromJolpi();
}
