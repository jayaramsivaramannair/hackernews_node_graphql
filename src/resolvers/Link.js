//Resolver is called postedBy because we intend to return value of postedBy field from the Link type
function postedBy(parent, args, context) {
  return context.prisma.link.findUnique({where: { id: parent.id }}).postedBy()
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
  postedBy
}