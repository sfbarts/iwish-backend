const categoriesRouter = require('express').Router()
const Category = require('../models/category')

//Get list of categories
categoriesRouter.get('/', async (request, response) => {
  const categories = await Category.find({})
  response.json(categories)
})

//Add new category
categoriesRouter.post('/', async (request, response) => {
  const body = request.body

  //temporary user id
  let userID = '650a14c573d510a95e0fb3bf'

  const category = new Category({
    name: body.name,
    user: userID,
  })

  const addCategory = await category.save()

  response.status(201).json(addCategory)
})

module.exports = categoriesRouter
