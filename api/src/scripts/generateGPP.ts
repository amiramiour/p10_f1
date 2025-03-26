import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function generateGPP() {
  try {
    const gps = await prisma.gP.findMany();
    const piloteEcuries = await prisma.piloteEcurie.findMany({
      where: {
        year: {
            gte: new Date('2023-01-01T00:00:00Z'),
            lt: new Date('2024-01-01T00:00:00Z'),
          }
    },
    });

    let count = 0;

    for (const gp of gps) {
      for (const pe of piloteEcuries) {
        // Vérifie si déjà existant (évite les doublons)
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

generateGPP();
