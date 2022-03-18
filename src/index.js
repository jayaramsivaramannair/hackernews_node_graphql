//Import Apollo Server package
const {ApolloServer} = require('apollo-server');
const fs = require('fs');
const path = require('path');
const {getUserId} = require('./utils');

//Import PrismaClient
const {PrismaClient} = require('@prisma/client')


//Import Resolvers for Queries and Mutations
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')

//2 
const resolvers = {
  Query,
  Mutation,
  Link,
  User,
}

//Create an instance of a PrismaClient
const prisma = new PrismaClient()


//3 Create the GraphQL server by passing in an object containing typeDefs and resolvers
const server = new ApolloServer({
  //typeDefs can be provided either directly as a string
  // or it can be provided by referencing a file that contains the schema definition
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
  //update the server to add an instance of the PrismaClient
  // Adding context will allow us to access context.prisma in all the resolvers
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      userId:
        req && req.headers.authorization ? getUserId(req) : null
    };
  }
})


server
.listen()
.then(({url}) => 
  console.log(`Server is running on ${url}`)
);
