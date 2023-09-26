const usersRouter = require('express').Router()
const User = require('../models/user')
const { validateAccessToken } = require('../middleware/auth0.middleware')

// Temp router for listing users
usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

// Temp router for creating users
usersRouter.post('/', validateAccessToken, async (request, response) => {
  const auth = request.auth
  const auth0_id = auth.payload.sub

  let user = await User.findOne({ auth0_id })

  if (user) {
    return response
      .status(201)
      .json({ message: 'User already exists', result: user })
  }

  user = new User({ auth0_id })
  const savedUser = await user.save()

  response.status(201).json({ message: 'User created', result: savedUser })
})

module.exports = usersRouter
