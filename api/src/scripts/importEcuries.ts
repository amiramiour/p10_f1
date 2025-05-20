import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const API_KEY = process.env.F1_API_KEY;

if (!API_KEY) {
  console.error('F1_API_KEY is missing in environment variables');
  process.exit(1);
}

export async function importEcuries() {
  try {
    const { data } = await axios.get('https://v1.formula-1.api-sports.io/teams', {
      params: { season: 2025 },
      headers: { 'x-apisports-key': API_KEY },
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
          color: '', // à compléter plus tard
        },
      });
    }

    console.log(`${teams.length} écuries imported with success`);
  } catch (error) {
    console.error('Error importing écuries:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  importEcuries();
}
