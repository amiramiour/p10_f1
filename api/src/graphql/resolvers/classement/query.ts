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
};
