const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const usersRouter = require('./controllers/users')
const categoriesRouter = require('./controllers/categories')
const wishlistsRouter = require('./controllers/wishlists')
const itemsRouter = require('./controllers/items')
const { errorHandler } = require('./middleware/errorHandler')
const { MONGO_URI } = require('./utils/config')

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
app.use('/health', (req, res) => {
  res.send('ok')
})

app.use(errorHandler)

module.exports = app
