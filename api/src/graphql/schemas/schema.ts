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

  type AuthPayload {
    token: String
    user: User
  }

  type Query {
    hello: String
    getMe: User
    getMyLeagues: [League]

  }

  type Mutation {
    createUser(
      email: String!
      firstname: String!
      lastname: String!
      password: String!
    ): User

    loginUser(
      email: String!
      password: String!
    ): AuthPayload

    createLeague(
      name: String!
      private: Boolean!
    ): League
    joinLeague(
    shared_link: String!
    ): League
  }
`;
