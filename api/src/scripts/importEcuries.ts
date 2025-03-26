import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const API_KEY = process.env.F1_API_KEY as string;

async function importEcuries() {
  try {
    const { data } = await axios.get('https://v1.formula-1.api-sports.io/teams', {
      params: {
        season: 2023,
      },
      headers: {
        'x-apisports-key': API_KEY,
      },
    });

    const teams = data.response;

    for (const team of teams) {
      await prisma.ecurie.upsert({
        where: { id_api_ecuries: team.id },
        update: {},
        create: {
          id_api_ecuries: team.id,
          name: team.name,
          logo: team.logo,
          color: '', // à compléter plus tard à la main
        },
      });
    }

    console.log(` ${teams.length} écuries imported with success`);
  } catch (error) {
    console.error(' Error importing écuries:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importEcuries();
