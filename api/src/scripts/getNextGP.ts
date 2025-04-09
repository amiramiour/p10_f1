import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getNextGP() {
  try {
    const now = new Date();

    const nextGP = await prisma.gP.findFirst({
      where: {
        date: {
          gte: now,
        },
      },
      orderBy: {
        date: 'asc',
      },
      include: {
        track: true,
      },
    });

    if (!nextGP) {
      console.log(' Aucun GP à venir trouvé');
      return;
    }

    console.log(' Prochain Grand Prix :');
    console.log(`  ${nextGP.date.toISOString()}`);
    console.log(`  ${nextGP.track.track_name} (${nextGP.track.country_name})`);
  } catch (err) {
    console.error('Erreur lors de la récupération du prochain GP :', err);
  } finally {
    await prisma.$disconnect();
  }
}

getNextGP();
