function info(parent, args, context) {
  return "This is the GraphQL API for Hacker News Project"
}


function feed(parent, args, context) {
  return context.prisma.link.findMany()
}

async function link(parent, args, context){
  const result = await context.prisma.link.findUnique({
    where: {
      id: Number(args.id),
    }
  })
  return result
}


module.exports = {
  feed,
  link,
  info,
}