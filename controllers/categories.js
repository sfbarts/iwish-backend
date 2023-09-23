const categoriesRouter = require('express').Router()
const Category = require('../models/category')
const Wishlist = require('../models/wishlist')

//Get list of categories by userId
categoriesRouter.get('/', async (request, response) => {
  const tempUserId = '650a14c573d510a95e0fb3bf'
  //temporarily return the userid
  const categories = await Category.find({
    user: tempUserId,
  }).populate('user', { name: 1, id: 1 })
  response.json(categories)
})

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
