const categoriesRouter = require('express').Router()
const Category = require('../models/category')
const Wishlist = require('../models/wishlist')
const { validateAccessToken } = require('../middleware/auth0.middleware')
const { userExtractor } = require('../middleware/userExtractor')

//CATEGORIES ROUTER
//All routes are protected. This is because users need to be authenticated and data is user specific.

//Get list of categories by userId
categoriesRouter.get(
  '/',
  validateAccessToken,
  userExtractor,
  async (request, response) => {
    const userId = request.user.id

    const categories = await Category.find({
      user: userId,
    }).populate('user', { auth0_id: 1, id: 1 })

    response.json(categories)
  }
)

//Get whole category + wishlists based on category Id
categoriesRouter.get(
  '/:categoryId',
  validateAccessToken,
  userExtractor,
  async (request, response) => {
    const userId = request.user.id
    let categoryBundle = []
    const category = await Category.findById(request.params.categoryId)

    //if user doesn't own the category return not authorized
    if (userId !== category.user.toString()) {
      return response.status(401).send('Not authorized')
    }

    const wishlists = await Wishlist.find({
      category: request.params.categoryId,
    }).populate('category', { name: 1 })
    categoryBundle.push(category)
    categoryBundle.push(wishlists)

    response.json(categoryBundle)
  }
)

//Add new category
categoriesRouter.post(
  '/',
  validateAccessToken,
  userExtractor,
  async (request, response) => {
    const body = request.body

    const userId = request.user.id

    const category = new Category({
      name: body.name,
      user: userId,
    })

    const addCategory = await category.save()

    response.status(201).json(addCategory)
  }
)

categoriesRouter.put(
  '/:categoryId',
  validateAccessToken,
  userExtractor,
  async (request, response) => {
    const userId = request.user.id
    const body = request.body

    const category = await Category.findById(request.params.categoryId)

    //if user doesn't own the category return not authorized
    if (category.user.toString() !== userId) {
      return response.status(401).send('Not authorized')
    }

    const updates = {
      name: body.name,
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      request.params.categoryId,
      updates,
      {
        new: true,
        context: 'query',
      }
    )
    response.json(updatedCategory)
  }
)

categoriesRouter.delete(
  '/:categoryId',
  validateAccessToken,
  userExtractor,
  async (request, response) => {
    const userId = request.user.id
    const category = await Category.findById(request.params.categoryId)

    //if user doesn't own the category return not authorized
    if (category.user.toString() !== userId) {
      return response.status(401).send('Not authorized')
    }

    await Category.findByIdAndDelete(request.params.categoryId)
    return response.status(204).end()
  }
)

module.exports = categoriesRouter
