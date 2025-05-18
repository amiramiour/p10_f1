import { gql } from 'apollo-server';

export const typeDefs = gql`
  type User {
    id: String
    email: String
    firstname: String
    lastname: String
    role: String
    id_avatar: Int
  }

  type League {
    id: Int
    name: String
    private: Boolean
    shared_link: String
    active: Boolean
    id_avatar: Int
  }

  type LeagueMember {
    id: String
    email: String
    firstname: String
    lastname: String
    role: String
  }

  type AuthPayload {
    token: String
    user: User
  }

  type ClassementResult {
    position: Int!
    isDNF: Boolean!
    pilote: Pilote!
    ecurie: Ecurie!
  }

  type Pilote {
    id_api_pilotes: Int!
    name: String!
    picture: String
    name_acronym: String
  }

  type Ecurie {
    id_api_ecuries: Int!
    name: String!
    logo: String
    color: String
  }
  type GP {
    id_api_races: String!
    season: String!
  date: String!
  time: String!
  track: Track!
}

type Track {
  id_api_tracks: Int!
  country_name: String!
  track_name: String!
  picture_country: String
  picture_track: String
}
type BetSelectionResult {
  id: Int!
  points_p10: String
  points_dnf: String
  gp: GP!
  pilote_p10: Pilote!
  pilote_dnf: Pilote!
}




  type Query {
    hello: String
    getMe: User
    getMyLeagues: [League]
    getLeagueUsers(leagueId: Int!): [LeagueMember]
    getClassementByGP(gpId: String!): [ClassementResult!]!
    getNextGP: GP
    getMyBets: [BetSelectionResult!]!   

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
    
    createBetSelection(
  gpId: String!
  piloteP10Id: Int!
  piloteDNFId: Int!
  ): BetSelectionResult

  }
`;
