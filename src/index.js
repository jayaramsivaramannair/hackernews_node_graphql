//Import Apollo Server package
const {ApolloServer} = require('apollo-server');
const fs = require('fs');
const path = require('path');


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
  },
  Mutation: {
    post: (parent, args) => {

      let idCount = links.length

      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      }
      
      links.push(link)
      return link
    }
  }
  
}


//3 Create the GraphQL server by passing in an object containing typeDefs and resolvers
const server = new ApolloServer({
  //typeDefs can be provided either directly as a string
  // or it can be provided by referencing a file that contains the schema definition
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
})


server
.listen()
.then(({url}) => 
  console.log(`Server is running on ${url}`)
);
