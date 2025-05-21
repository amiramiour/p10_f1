import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkGPTracks() {
  const gps = await prisma.gP.findMany({
    take: 10,
    orderBy: { date: 'asc' },
    include: {
      track: true,
    },
  });

  console.log('\n Vérification des GP avec leurs circuits associés :');
  gps.forEach(gp => {
    console.log(`- ${gp.date.toISOString().split('T')[0]} → ${gp.track?.track_name || ' Aucun circuit trouvé'}`);
  });

  await prisma.$disconnect();
}

checkGPTracks();
