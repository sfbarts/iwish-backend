const itemsRouter = require('express').Router()
const Item = require('../models/item')
const Wishlist = require('../models/wishlist')
const { validateAccessToken } = require('../middleware/auth0.middleware')
const { userExtractor } = require('../middleware/userExtractor')

//Get list of items
itemsRouter.get('/', async (request, response) => {
  const items = await Item.find({}).populate('wishlist', { name: 1 })
  response.json(items)
})

//Get list of items based on the wishlist id
itemsRouter.get(
  '/:wishlistId',
  validateAccessToken,
  userExtractor,
  async (request, response) => {
    const userId = request.user.id
    const wishlist = await Wishlist.findById(request.params.wishlistId)

    //if user doesn't own the wishlist return not authorized
    if (userId !== wishlist.user.toString()) {
      return response.status(401).send('Not authorized')
    }
    const items = await Item.find({
      wishlist: request.params.wishlistId,
    })
    response.json(items)
  }
)

//Add new item
itemsRouter.post(
  '/',
  validateAccessToken,
  userExtractor,
  async (request, response) => {
    const body = request.body
    const userId = request.user.id
    const wishlist = await Wishlist.findById(body.wishlist)

    //if user doesn't own the wishlist return not authorized
    if (userId !== wishlist.user.toString()) {
      return response.status(401).send('Not authorized')
    }

    const item = new Item({
      name: body.name,
      url: body.url,
      wishlist: body.wishlist,
      user: userId,
    })

    const addItem = await item.save()

    response.status(201).json(addItem)
  }
)

//test batch update route
itemsRouter.put(
  '/',
  validateAccessToken,
  userExtractor,
  async (request, response) => {
    const body = request.body
    const wishlistId = body[0].wishlist
    const userId = request.user.id

    const wishlist = await Wishlist.findById(wishlistId)

    //if user doesn't own the wishlist return not authorized
    if (userId !== wishlist.user.toString()) {
      return response.status(401).send('Not authorized')
    }
    const batchUpdateItems = body.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: {
          $set: {
            name: item.name,
            url: item.url,
            price: item.price,
            acquired: item.acquired,
          },
        },
      },
    }))

    const batchUpdate = await Item.bulkWrite(batchUpdateItems)

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
    response.json({
      message: 'Batch update was successful',
      result: batchUpdate,
    })
  }
)

itemsRouter.delete(
  '/:id',
  validateAccessToken,
  userExtractor,
  async (request, response) => {
    const userId = request.user.id
    const item = await Item.findById(request.params.id)

    //if user doesn't own the item return not authorized
    if (item.user.toString() !== userId) {
      return response.status(401).send('Not authorized')
    }

    await Item.findByIdAndDelete(request.params.id)
    return response.status(204).end()
  }
)

module.exports = itemsRouter
