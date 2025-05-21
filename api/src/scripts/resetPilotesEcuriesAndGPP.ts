import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetPilotesEcuriesAndGPP() {
  try {
    console.log(' Suppression des données liées aux pilotes, écuries et GPP...');

    await prisma.gPP.deleteMany();
    console.log(' GPP supprimés');

    await prisma.piloteEcurie.deleteMany();
    console.log(' Liens Pilote ↔ Écurie supprimés');

    await prisma.pilote.deleteMany();
    console.log(' Pilotes supprimés');

    await prisma.ecurie.deleteMany();
    console.log(' Écuries supprimées');

    console.log(' Réinitialisation terminée');
  } catch (err) {
    console.error(' Erreur lors de la suppression :', err);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  resetPilotesEcuriesAndGPP();
}
