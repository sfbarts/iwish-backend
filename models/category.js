const mongoose = require('mongoose')
const Wishlist = require('./wishlist')

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, maxLength: 50 },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})

categorySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

// Remove all wishlists associated with this category
categorySchema.pre(
  'findOneAndDelete',
  { query: true, document: false },
  async function (next) {
    const category = await this.model.findOne(this.getQuery())

    await Wishlist.deleteMany({ category: category._id })
    next()
  }
)

const Category = mongoose.model('Category', categorySchema)

module.exports = Category
