//Import Apollo Server package
const {ApolloServer} = require('apollo-server');
const fs = require('fs');
const path = require('path');

//Import PrismaClient
const {PrismaClient} = require('@prisma/client')

//2 
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: async (parent, args, context) => {
      return context.prisma.link.findMany()
    },
    link: async (parent, args, context) => {
      const result = await context.prisma.link.findUnique({
        where: {
          id: Number(args.id),
        }
      })
      return result
    }
  },

  Link: {
    id: (parent) => parent.id,
    description: (parent) => parent.description,
    url: (parent) => parent.url,
  },
  Mutation: {
    post: (parent, args, context, info) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      })
      return newLink
    },

    deleteLink: async (parent, args, context, info) => {
      const deletedLink = await context.prisma.link.delete({
        where: {
          id: Number(args.id)
        }
      })

      return deletedLink
    },


    updateLink: async (parent, args, context, info) => {
      const updatedLink = await context.prisma.link.update({
        where: {
          id: Number(args.id)
        },
        data: {
          url: args.url,
          description: args.description,
        }
      })
      
      return updatedLink
    }
  }
  
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
  context: {
    prisma,
  }
})


server
.listen()
.then(({url}) => 
  console.log(`Server is running on ${url}`)
);
