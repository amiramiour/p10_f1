// src/graphql/resolvers/gp/query.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const gpQueries = {
  getNextGP: async () => {
    const now = new Date();

    const gp = await prisma.gP.findFirst({
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

    if (!gp) return null;

    return {
      ...gp,
      id_api_races: gp.id_api_races.toString(), // conversion ID
      date: new Date(gp.date).toISOString().split('T')[0],
      track: {
        ...gp.track,
        id_api_tracks: gp.track.id_api_tracks.toString(), // aussi ici
      },
    };
  },
};
