import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const API_URL = 'https://api.openf1.org/v1/drivers?session_key=latest';
const year = 2025;

async function importPilotesAndEcuries() {
  try {
    const response = await axios.get(API_URL);
    const pilotesData = response.data;

    const addedPilotes = new Set();
    const addedEcuries = new Set();
    let countLinks = 0;

    for (const pilote of pilotesData) {
      const {
        full_name,
        headshot_url,
        name_acronym,
        team_name,
        driver_number,
      } = pilote;

      if (!full_name || !team_name || !driver_number) {
        console.warn(`⛔ Incomplet : ${JSON.stringify(pilote)}`);
        continue;
      }

      const piloteInDb = await prisma.pilote.upsert({
        where: { driver_number: parseInt(driver_number) },
        update: {},
        create: {
          driver_number: parseInt(driver_number),
          name: full_name,
          picture: headshot_url ?? '',
          name_acronym,
        },
      });

      addedPilotes.add(piloteInDb.driver_number);

      const ecurieInDb = await prisma.ecurie.upsert({
        where: { name: team_name },
        update: {},
        create: {
          name: team_name,
          logo: '',
          color: '#CCCCCC',
        },
      });

      addedEcuries.add(ecurieInDb.name);

      // Lien Pilote <-> Ecurie
      const existingLink = await prisma.piloteEcurie.findFirst({
        where: {
          id_pilote: piloteInDb.id_api_pilotes,
          id_ecurie: ecurieInDb.id_api_ecuries,
          year: new Date(`${year}-01-01`),
        },
      });

      if (existingLink) {
        console.log(`ℹ️ Lien déjà existant : ${full_name} -> ${team_name}`);
        continue;
      }

      await prisma.piloteEcurie.create({
        data: {
          id_pilote: piloteInDb.id_api_pilotes,
          id_ecurie: ecurieInDb.id_api_ecuries,
          year: new Date(`${year}-01-01`),
        },
      });

      console.log(`🔗 Lien créé : ${full_name} -> ${team_name}`);
      countLinks++;
    }

    console.log(`✅ ${addedPilotes.size} pilotes importés`);
    console.log(`✅ ${addedEcuries.size} écuries importées`);
    console.log(`🔗 ${countLinks} liens pilote/écurie ajoutés pour ${year}`);
  } catch (error) {
    console.error('❌ Erreur import pilotes + écuries :', error);
  } finally {
    await prisma.$disconnect();
  }
}

importPilotesAndEcuries();