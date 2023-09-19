const usersRouter = require('express').Router()
const User = require('../models/user')

// Temp router for listing users
usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

// Temp router for creating users
usersRouter.post('/', async (request, response) => {
  const { email, name, password } = request.body

  const passwordHash = password

  const user = new User({ email, name, passwordHash })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter
