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
      id_api_races: gp.id_api_races.toString(),
      date: gp.date.toISOString().split('T')[0],
      time: gp.time?.toISOString() || '',
      track: {
        ...gp.track,
        id_api_tracks: gp.track.id_api_tracks.toString(),
      },
    };
  },

  getUpcomingGPs: async () => {
    const now = new Date();

    const gps = await prisma.gP.findMany({
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

    return gps.map((gp) => ({
      ...gp,
      id_api_races: gp.id_api_races.toString(),
      date: gp.date.toISOString().split('T')[0],
      time: gp.time?.toISOString() || '',
      track: {
        ...gp.track,
        id_api_tracks: gp.track.id_api_tracks.toString(),
      },
    }));
  },

  getPastGPs: async () => {
    const now = new Date();

    const gps = await prisma.gP.findMany({
      where: {
        date: {
          lt: now,
        },
      },
      orderBy: {
        date: 'desc',
      },
      include: {
        track: true,
      },
    });

    return gps.map((gp) => ({
      ...gp,
      id_api_races: gp.id_api_races.toString(),
      date: gp.date.toISOString().split('T')[0],
      time: gp.time?.toISOString() || '',
      track: {
        ...gp.track,
        id_api_tracks: gp.track.id_api_tracks.toString(),
      },
    }));
  },

  getAllGPs: async () => {
    const gps = await prisma.gP.findMany({
      orderBy: {
        date: 'asc',
      },
      include: {
        track: true,
      },
    });

    return gps.map((gp) => ({
      ...gp,
      id_api_races: gp.id_api_races.toString(),
      date: gp.date.toISOString().split('T')[0],
      time: gp.time?.toISOString() || '',
      track: {
        ...gp.track,
        id_api_tracks: gp.track.id_api_tracks.toString(),
      },
    }));
  },

  gp: async (_: any, args: { id: string }) => {
    const gp = await prisma.gP.findUnique({
      where: {
        id_api_races: BigInt(args.id),
      },
      include: {
        track: true,
      },
    });

    if (!gp) throw new Error('GP not found');

    return {
      ...gp,
      id_api_races: gp.id_api_races.toString(),
      date: gp.date.toISOString(),
      time: gp.time.toISOString(),
      track: {
        ...gp.track,
        id_api_tracks: gp.track.id_api_tracks.toString(),
      },
    };
  },
  getPilotesByGP: async (_: any, args: { gpId: string }) => {
  const pilotes = await prisma.gPP.findMany({
    where: {
      id_gp: BigInt(args.gpId),
    },
    include: {
      pilote: true,
    },
  });

  return pilotes.map((gpP) => ({
    ...gpP.pilote,
    id_api_pilotes: gpP.pilote.id_api_pilotes,
  }));
},

};
