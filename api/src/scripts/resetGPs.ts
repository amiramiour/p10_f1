import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function resetGPs() {
  console.log(' Suppression des données liées aux GP...');

  await prisma.gPClassement.deleteMany();
  console.log(' GPClassement supprimés');

  await prisma.gPP.deleteMany();
  console.log(' GPP supprimés');

  await prisma.betSelectionResult.deleteMany();
  console.log(' BetSelectionResult supprimés');

  await prisma.gP.deleteMany();
  console.log(' GP supprimés');

  await prisma.track.deleteMany();
  console.log(' Circuits (Track) supprimés');

  await prisma.$disconnect();
  console.log(' Réinitialisation complète terminée');
}

resetGPs();
