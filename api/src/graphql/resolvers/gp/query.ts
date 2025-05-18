// src/graphql/resolvers/gp/query.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const gpQueries = {
  getNextGP: async () => {
    const now = new Date();

    return await prisma.gP.findFirst({
      where: {
        date: {
          gt: now,
        },
      },
      orderBy: {
        date: 'asc',
      },
      include: {
        track: true,
      },
    });
  },
};
