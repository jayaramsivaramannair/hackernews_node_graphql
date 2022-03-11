//Import Apollo Server package
const {ApolloServer} = require('apollo-server');


//dummy list of links
let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'

}]


//2 
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
  },

  
  Link: {
    id: (parent) => parent.id,
    description: (parent) => parent.description,
    url: (parent) => parent.url,
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
