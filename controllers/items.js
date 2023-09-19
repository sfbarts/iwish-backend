const itemsRouter = require('express').Router()
const Item = require('../models/item')

//Get list of items
itemsRouter.get('/', async (request, response) => {
  const items = await Item.find({}).populate('wishlist', { name: 1 })
  response.json(items)
})

//Add new item
itemsRouter.post('/', async (request, response) => {
  const body = request.body

  //temporary category id
  const wishlistID = '650a1a9d561cd48a13a4f05a'

  const item = new Item({
    name: body.name,
    url: body.url,
    price: Number(body.price),
    wishlist: wishlistID,
  })

  const addItem = await item.save()

  response.status(201).json(addItem)
})

module.exports = itemsRouter
