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
      date: new Date(gp.date).toISOString().split('T')[0],
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
};
