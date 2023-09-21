const usersRouter = require('./controllers/users')
const categoriesRouter = require('./controllers/categories')
const wishlistsRouter = require('./controllers/wishlists')
const itemsRouter = require('./controllers/items')
const express = require('express')
const cors = require('cors')
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

app.use(cors())
app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/wishlists', wishlistsRouter)
app.use('/api/items', itemsRouter)

module.exports = app
