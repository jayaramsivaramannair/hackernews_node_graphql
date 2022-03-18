const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {APP_SECRET, getUserId} = require('../utils');


async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10)

  //Create a new user but store the encrypted password instead of the user provided password
  const user = await context.prisma.user.create({data: {...args, password}})

  const token = jwt.sign({userId: user.id}, APP_SECRET)

  return {
    token, 
    user,
  }
}


async function login(parent, args, context, info) {
  //Search for the user in the database
  const user = await context.prisma.user.findUnique({where: {email: args.email }})

  if(!user) {
    throw new Error('No such user found')
  }

  //Compare the passwords to see if they match or not
  const valid = await bcrypt.compare(args.password, user.password)

  if(!valid) {
    throw new Error('Invalid Password')
  }

  const token = jwt.sign({userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

async function post(parent, args, context, info){
  const { userId } = context;
  return await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: {connect: {id: userId}},
    },
  })
  
}

async function deleteLink(parent, args, context, info){
  const { userId } = context;
  if (userId) {
    const deletedLink = await context.prisma.link.delete({
      where: {
        id: Number(args.id)
      }
    })
  
    return deletedLink
  }

  throw new Error('Not Authenticated')
}

async function updateLink(parent, args, context, info){
  const { userId } = context;
  if (userId) {
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

  throw new Error('Not Authenticated')
}


module.exports = {
  signup,
  login, 
  post,
  updateLink,
  deleteLink,
}

