import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const classementQueries = {
  getClassementByGP: async (_: any, args: { gpId: string  }) => {
    const gpId = BigInt(args.gpId);

    const classements = await prisma.gPClassement.findMany({
      where: {
        id_gp: BigInt(gpId),
      },
      orderBy: {
        position: 'asc',
      },
      include: {
        gp_pilote: {
          include: {
            pilote: true,
            ecurie: true,
          },
        },
      },
    });

    return classements.map((entry) => ({
      position: entry.position,
      isDNF: entry.isDNF,
      pilote: entry.gp_pilote.pilote,
      ecurie: entry.gp_pilote.ecurie,
    }));
  },
  classementLigue: async (_: any, args: { leagueId: number }) => {
    const usersInLeague = await prisma.userLeague.findMany({
      where: {
        id_league: Number(args.leagueId),
      },
      include: {
        user: true,
      },
    });

    const result: { user: any; totalPoints: number }[] = [];

    for (const entry of usersInLeague) {
      const bets = await prisma.betSelectionResult.findMany({
        where: {
          id_utilisateur: entry.user.id,
        },
      });

      let total = 0;
      for (const bet of bets) {
        const p10 = parseInt(bet.points_p10 || '0');
        const dnf = parseInt(bet.points_dnf || '0');
        total += p10 + dnf;
      }

      result.push({
        user: entry.user,
        totalPoints: total,
      });
    }

    result.sort((a, b) => b.totalPoints - a.totalPoints);

    return result;
  },
};
