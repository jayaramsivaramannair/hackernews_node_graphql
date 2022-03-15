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
    },

    deleteLink: (parent, args) => {
      //An array without the deleted link
      const results = links.filter(link => link.id !== args.id)

      //An array with the deleted link
      const deleted = links.filter(link => link.id === args.id)

      //Replace items in the links with results
      links = results
      if (deleted.length === 0) {
        return null
      }

      return deleted[0]
    },


    updateLink: (parent, args) => {
      //An array without the selected link
      const results = links.filter(link => link.id !== args.id)

      //Selected Link for updation
      const updated = links.filter(link => link.id === args.id)[0]

      //Check if the url has been passed in or not
      if (args.url) {
        updated.url = args.url
      }

      //Check if the description has been passed in or not
      if (args.description) {
        updated.description = args.description
      }

      links = [...results, updated]

      return updated
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
