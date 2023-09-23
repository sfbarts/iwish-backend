const categoriesRouter = require('express').Router()
const Category = require('../models/category')

//Get list of categories
categoriesRouter.get('/', async (request, response) => {
  const categories = await Category.find({})
  response.json(categories)
})

//Get list of categories by userId
categoriesRouter.get('/:userId', async (request, response) => {
  //temporarily return the userid
  const categories = await Category.find({
    user: request.params.userId,
  }).populate('user', { name: 1, id: 1 })
  response.json(categories)
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
