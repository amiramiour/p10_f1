import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    hello: String
  }
  type User {
  id: String
  email: String
  firstname: String
  lastname: String
  role: String
  id_avatar: Int
  }
  type Mutation {
  createUser(
    email: String!
    firstname: String!
    lastname: String!
    password: String!
  ): User
}

`;
