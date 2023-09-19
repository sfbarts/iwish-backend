const wishlistsRouter = require('express').Router()
const Wishlist = require('../models/wishlist')

//Get list of wishlists
wishlistsRouter.get('/', async (request, response) => {
  const wishlists = await Wishlist.find({}).populate('category', { name: 1 })
  response.json(wishlists)
})

//Add new wishlist
wishlistsRouter.post('/', async (request, response) => {
  const body = request.body

  //temporary category id
  const categoryID = '650a18246081432e28194a05'

  const wishlist = new Wishlist({
    name: body.name,
    category: categoryID,
  })

  const addWishlist = await wishlist.save()

  response.status(201).json(addWishlist)
})

module.exports = wishlistsRouter
