// src/scripts/generateGPP.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export  async function generateGPP() {
  try {
    const gps = await prisma.gP.findMany();
    const piloteEcuries = await prisma.piloteEcurie.findMany({
      where: {
        year: new Date('2025-01-01'),
      },
    });

    let count = 0;

    for (const gp of gps) {
      for (const pe of piloteEcuries) {
        const exists = await prisma.gPP.findFirst({
          where: {
            id_gp: gp.id_api_races,
            id_pilote: pe.id_pilote,
            id_ecurie: pe.id_ecurie,
          },
        });

        if (!exists) {
          await prisma.gPP.create({
            data: {
              id_gp: gp.id_api_races,
              id_pilote: pe.id_pilote,
              id_ecurie: pe.id_ecurie,
            },
          });
          count++;
        }
      }
    }

    console.log(` ${count} entrées GPP générées avec succès`);
  } catch (err) {
    console.error(' Erreur lors de la génération des GPP :', err);
  } finally {
    await prisma.$disconnect();
  }
}
if (require.main === module) {
  generateGPP();
}

