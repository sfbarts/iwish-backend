const User = require('../models/user')

const userExtractor = async (request, response, next) => {
  const auth0_id = request.auth.payload.sub
  const user = await User.find({ auth0_id: auth0_id })
  request.user = user[0]
  next()
}

module.exports = {
  userExtractor,
}
