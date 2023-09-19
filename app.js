const usersRouter = require('./controllers/users')
const express = require('express')
const { MONGO_URI } = require('./utils/config')

const app = express()
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const url = MONGO_URI

mongoose
  .connect(url)
  .then((result) => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(express.json())

app.use('/api/users', usersRouter)

module.exports = app
