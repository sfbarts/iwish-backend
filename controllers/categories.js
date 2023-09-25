const categoriesRouter = require('express').Router()
const Category = require('../models/category')
const Wishlist = require('../models/wishlist')
const { validateAccessToken } = require('../middleware/auth0.middleware')
const { userExtractor } = require('../middleware/userExtractor')

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

    console.log(categories)
    response.json(categories)
  }
)

//Get whole category + items based on category Id
categoriesRouter.get('/:categoryId', async (request, response) => {
  let categoryBundle = []
  const category = await Category.findById(request.params.categoryId)
  const wishlists = await Wishlist.find({
    category: request.params.categoryId,
  }).populate('category', { name: 1 })
  categoryBundle.push(category)
  categoryBundle.push(wishlists)

  response.json(categoryBundle)
})

//Add new category
categoriesRouter.post('/', async (request, response) => {
  const body = request.body

  //temporary user id
  let userID = body.user

  const category = new Category({
    name: body.name,
    user: userID,
  })

  const addCategory = await category.save()

  response.status(201).json(addCategory)
})

categoriesRouter.put('/:categoryId', async (request, response) => {
  const body = request.body

  const category = {
    name: body.name,
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    request.params.categoryId,
    category,
    {
      new: true,
      context: 'query',
    }
  )
  response.json(updatedCategory)
})

categoriesRouter.delete('/:categoryId', async (request, response) => {
  await Category.findByIdAndDelete(request.params.categoryId)
  return response.status(204).end()
})

module.exports = categoriesRouter
