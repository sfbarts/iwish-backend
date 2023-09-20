const itemsRouter = require('express').Router()
const Item = require('../models/item')
const Wishlist = require('../models/wishlist')

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

  const item = new Item({
    name: body.name,
    url: body.url,
    price: Number(body.price),
    wishlist: body.wishlist,
  })

  const addItem = await item.save()

  //Provisional way to save the wishlist total
  const total = await Wishlist.aggregate([
    {
      $lookup: {
        from: 'items',
        localField: '_id',
        foreignField: 'wishlist',
        as: 'items',
      },
    },
    {
      $project: {
        name: 1,
        total: {
          $sum: '$items.price',
        },
      },
    },
    {
      $merge: 'wishlists', // Save the results back to the 'wishlists' collection
    },
  ])

  response.status(201).json(addItem)
})

module.exports = itemsRouter
