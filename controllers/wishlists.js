const wishlistsRouter = require('express').Router()
const Wishlist = require('../models/wishlist')
const Item = require('../models/item')
const { validateAccessToken } = require('../middleware/auth0.middleware')
const { userExtractor } = require('../middleware/userExtractor')

//Get list of wishlists
wishlistsRouter.get('/', async (request, response) => {
  const wishlists = await Wishlist.find({}).populate('category', { name: 1 })
  response.json(wishlists)
})

//Get wishlist and Items based on its id
wishlistsRouter.get(
  '/:wishlistId',
  validateAccessToken,
  userExtractor,
  async (request, response) => {
    let wishlistBundle = []
    const userId = request.user.id
    const wishlist = await Wishlist.findById(
      request.params.wishlistId
    ).populate('category', { name: 1 })

    //if user doesn't own the wishlist return not authorized
    if (userId !== wishlist.user.toString()) {
      return response.status(401).send('Not authorized')
    }

    const wishlistItems = await Item.find({
      wishlist: request.params.wishlistId,
    })
    wishlistBundle.push(wishlist, wishlistItems)
    response.json(wishlistBundle)
  }
)

//Add new wishlist
wishlistsRouter.post(
  '/',
  validateAccessToken,
  userExtractor,
  async (request, response) => {
    const userId = request.user.id
    const body = request.body

    const wishlist = new Wishlist({
      name: body.name,
      category: body.category,
      user: userId,
    })

    const addWishlist = await wishlist.save()
    response.status(201).json(addWishlist)
  }
)

wishlistsRouter.put(
  '/:wishlistId',
  validateAccessToken,
  userExtractor,
  async (request, response) => {
    const userId = request.user.id
    const body = request.body

    const wishlist = await Wishlist.findById(request.params.wishlistId)

    //if user doesn't own the wishlist return not authorized
    if (wishlist.user.toString() !== userId) {
      return response.status(401).send('Not authorized')
    }

    const updates = {
      name: body.name,
    }

    const updatedWishlist = await Wishlist.findByIdAndUpdate(
      request.params.wishlistId,
      updates,
      {
        new: true,
        context: 'query',
      }
    )
    response.json(updatedWishlist)
  }
)

wishlistsRouter.delete(
  '/:wishlistId',
  validateAccessToken,
  userExtractor,
  async (request, response) => {
    const userId = request.user.id

    const wishlist = await Wishlist.findById(request.params.wishlistId)

    //if user doesn't own the wishlist return not authorized
    if (wishlist.user.toString() !== userId) {
      return response.status(401).send('Not authorized')
    }

    await Wishlist.findOneAndDelete({ _id: request.params.wishlistId })
    return response.status(204).end()
  }
)

module.exports = wishlistsRouter
