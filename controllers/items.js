const itemsRouter = require('express').Router()
const Item = require('../models/item')

//Get list of items
itemsRouter.get('/', async (request, response) => {
  const items = await Item.find({}).populate('wishlist', { name: 1 })
  response.json(items)
})

//Get list of items based on the wishlist id
itemsRouter.get('/:wishlistId', async (request, response) => {
  const items = await Item.find({
    wishlist: request.params.wishlistId,
  }).populate('wishlist', { name: 1 })
  response.json(items)
})

//Add new item
itemsRouter.post('/', async (request, response) => {
  const body = request.body

  //temporary category id
  // const wishlistID = '650a1a9d561cd48a13a4f05a'

  const item = new Item({
    name: body.name,
    url: body.url,
    price: Number(body.price),
    wishlist: body.wishlist,
  })

  const addItem = await item.save()

  response.status(201).json(addItem)
})

module.exports = itemsRouter
