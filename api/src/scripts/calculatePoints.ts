import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const POINTS_PAR_POSITION: Record<number, number> = {
  1: 1, 2: 2, 3: 4, 4: 6, 5: 8,
  6: 10, 7: 12, 8: 15, 9: 18, 10: 25,
  11: 18, 12: 15, 13: 12, 14: 10, 15: 8,
  16: 6, 17: 4, 18: 2, 19: 1, 20: 1,
};

export async function calculatePoints() {
  console.log('🔄 Calcul des points pour les paris...');

  const bets = await prisma.betSelectionResult.findMany({
    include: {
      gp: true,
      pilote_p10: true,
      pilote_dnf: true,
    },
  });

  let updated = 0;

  for (const bet of bets) {
    const gpDate = bet.gp.date;
    const now = new Date();
    if (gpDate > now) continue; 

    const classement = await prisma.gPClassement.findMany({
      where: { id_gp: bet.id_gp },
      include: {
        gp_pilote: true,
      },
    });

    let p10Points = '0';
    let dnfPoints = '0';

    const p10Entry = classement.find(
      (c) => c.gp_pilote.id_pilote === bet.id_pilote_p10
    );
    if (p10Entry) {
      const points = POINTS_PAR_POSITION[p10Entry.position] ?? 0;
      p10Points = points.toString();
    }

    const dnfEntry = classement.find(
      (c) => c.gp_pilote.id_pilote === bet.id_pilote_dnf && c.isDNF
    );
    if (dnfEntry) {
      dnfPoints = '10'; 
    }

    await prisma.betSelectionResult.update({
      where: { id: bet.id },
      data: {
        points_p10: p10Points,
        points_dnf: dnfPoints,
      },
    });

    updated++;
  }

  console.log(`${updated} paris mis à jour.`);
  await prisma.$disconnect();
}

if (require.main === module) {
  calculatePoints();
}
