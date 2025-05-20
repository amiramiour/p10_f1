export const leagueResolvers = {
  League: {
    users: (parent: any) => parent.userLeagues,
  },
};
