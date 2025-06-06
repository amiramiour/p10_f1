import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { PrismaClient } from '@prisma/client'; // ← maintenant c'est bon
import axios from 'axios';

const prisma = new PrismaClient();

export async function importPilotes() {
  try {
    const { data: drivers } = await axios.get('https://api.openf1.org/v1/drivers');

    const uniquePilots = new Map();

    for (const pilot of drivers) {
      if (!pilot.full_name || !pilot.driver_number) continue;

      const id = parseInt(pilot.driver_number);
      if (!uniquePilots.has(id)) {
        uniquePilots.set(id, {
          id_api_pilotes: id,
          name: pilot.full_name,
          name_acronym: pilot.name_acronym || '',
          picture: pilot.headshot_url || '',
        });
      }
    }

    for (const [, pilot] of uniquePilots) {
      await prisma.pilote.upsert({
        where: { id_api_pilotes: pilot.id_api_pilotes },
        update: {},
        create: pilot,
      });
    }

    console.log(`${uniquePilots.size} pilotes imported with success`);
  } catch (error) {
    console.error('Error importing pilotes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  importPilotes();
}
