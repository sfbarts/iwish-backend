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

app.get('/demo', (request, response) => {
  response.send('Hello World')
})

module.exports = app
