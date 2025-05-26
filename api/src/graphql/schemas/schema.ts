import { gql } from 'apollo-server';

export const typeDefs = gql`
  type User {
    id: String!
    email: String!
    firstname: String!
    lastname: String!
    role: String!
    id_avatar: Int
    avatar: Avatar
    leagues: [UserLeague!]!
    bets: [BetSelectionResult!]!
  }

  type League {
    id: Int!
    name: String!
    private: Boolean!
    shared_link: String
    active: Boolean!
    id_avatar: Int
    avatar: Avatar
    users: [UserLeague!]!
  }

  type Avatar {
    id: Int!
    picture_avatar: String!
  }

  type UserLeague {
    id: Int!
    league: League!
    user: User!
    role: String!
  }

  type BetSelectionResult {
    id: Int!
    points_p10: String
    points_dnf: String
    gp: GP!
    pilote_p10: Pilote!
    pilote_dnf: Pilote!
    user: User!
  }

  type GP {
    id_api_races: ID!
    season: String!
    date: String!
    time: String!
    track: Track!
    classement: [GPClassement!]!
    pilotes: [GPPilote!]!
  }

  type Track {
    id_api_tracks: String!
    country_name: String!
    track_name: String!
    picture_country: String
    picture_track: String
  }

  type Pilote {
    id_api_pilotes: Int!
    name: String!
    picture: String
    name_acronym: String
    ecuries: [PiloteEcurie!]!
  }

  type Ecurie {
    id_api_ecuries: Int!
    name: String!
    logo: String
    color: String
    pilotes: [PiloteEcurie!]!
  }

  type PiloteEcurie {
    id: Int!
    pilote: Pilote!
    ecurie: Ecurie!
    year: String!
  }

  type GPPilote {
    id: Int!
    gp: GP!
    pilote: Pilote!
    ecurie: Ecurie!
  }

  type GPClassement {
    id: Int!
    gp: GP!
    gp_pilote: GPPilote!
    isDNF: Boolean!
    position: Int!
  }

  type ClassementResult {
    position: Int!
    isDNF: Boolean!
    pilote: Pilote!
    ecurie: Ecurie!
  }

  type ClassementLigueEntry {
    user: User!
    totalPoints: Int!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    hello: String
    getMe: User
    getMyLeagues: [League]
    getLeagueUsers(leagueId: Int!): [UserLeague]
    getClassementByGP(gpId: String!): [ClassementResult!]!
    classementLigue(leagueId: ID!): [ClassementLigueEntry!]!
    getMyBets: [BetSelectionResult!]!
    getBetsByGP(gpId: ID!): [BetSelectionResult!]!
    betsByUser(userId: ID!): [BetSelectionResult!]!
    gps(season: String): [GP!]!
    gp(id: ID!): GP
    pilotes: [Pilote!]!
    ecuries: [Ecurie!]!
    users: [User!]!
    user(id: ID!): User
    getNextGP: GP
    getUpcomingGPs: [GP!]!
    getPastGPs: [GP!]!
    getAllGPs: [GP!]!
    league(id: ID!): League
      getPublicLeagues: [League!]!

    track(id: ID!): Track
    pilote(id: ID!): Pilote
    ecurie(id: ID!): Ecurie
  }

  type Mutation {
    createUser(
      email: String!
      firstname: String!
      lastname: String!
      password: String!
    ): User

    loginUser(email: String!, password: String!): AuthPayload

    createLeague(name: String!, private: Boolean!): League
    joinLeague(shared_link: String!): League
    deleteLeague(leagueId: Int!): Boolean!

    createBetSelection(
      gpId: String!
      piloteP10Id: Int!
      piloteDNFId: Int!
    ): BetSelectionResult!

    updateBetSelection(
      betId: Int!
      piloteP10Id: Int
      piloteDNFId: Int
    ): BetSelectionResult!

    deleteBetSelection(betId: Int!): Boolean!
    updateUser(firstname: String, lastname: String, password: String): User!
    deleteUser: Boolean!
  }
`;
