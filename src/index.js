//Import Apollo Server package
const {ApolloServer} = require('apollo-server');


//1
const typeDefs = `
  type Query {
    info: String!
  }
`

//2 
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`
  }
}


//3 Create the GraphQL server by passing in an object containing typeDefs and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
})


server
.listen()
.then(({url}) => 
  console.log(`Server is running on ${url}`)
);
