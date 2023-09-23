const wishlistsRouter = require('express').Router()
const Wishlist = require('../models/wishlist')

//Get list of wishlists
wishlistsRouter.get('/', async (request, response) => {
  const wishlists = await Wishlist.find({}).populate('category', { name: 1 })
  response.json(wishlists)
})

//Get wishlist based on its id
wishlistsRouter.get('/:wishlistId', async (request, response) => {
  const wishlist = await Wishlist.findById(request.params.wishlistId)
  response.json(wishlist)
})

//Add new wishlist
wishlistsRouter.post('/', async (request, response) => {
  const body = request.body

  //temporary category id
  // const categoryID = '650a18246081432e28194a05'

  const wishlist = new Wishlist({
    name: body.name,
    category: body.category,
  })

  const addWishlist = await wishlist.save()
  response.status(201).json(addWishlist)
})

wishlistsRouter.put('/:wishlistId', async (request, response) => {
  const body = request.body

  const wishlist = {
    name: body.name,
  }

  const updatedWishlist = await Wishlist.findByIdAndUpdate(
    request.params.wishlistId,
    wishlist,
    {
      new: true,
      context: 'query',
    }
  )
  response.json(updatedWishlist)
})

wishlistsRouter.delete('/:wishlistId', async (request, response) => {
  await Wishlist.findByIdAndDelete(request.params.wishlistId)
  return response.status(204).end()
})

module.exports = wishlistsRouter
