//Resolver is called links because we intend to return value of the links field from User type
function links(parent, args, context) {
  return context.prisma.user.findUnique({where: {id: parent.id}}).links()
}

module.exports = {
  links,
}