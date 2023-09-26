const mongoose = require('mongoose')
const Item = require('./item')

const wishlistSchema = new mongoose.Schema({
  name: { type: String },
  total: { type: Number, default: 0.0 },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})

wishlistSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

// Remove all items when a single wishlist is deleted
wishlistSchema.pre(
  'findOneAndDelete',
  { query: true, document: false },
  async function (next) {
    const wishlist = await this.model.findOne(this.getQuery())
    console.log(wishlist._id)
    await Item.deleteMany({ wishlist: wishlist._id })
    next()
  }
)

// Remove all items when multiple wishlists are deleted as a consequence of a category deletion.
wishlistSchema.pre(
  'deleteMany',
  { query: true, document: false },
  async function (next) {
    const wishlist = await this.model.findOne(this.getQuery())
    console.log(wishlist._id)
    // Remove all wishlists associated with this category
    await Item.deleteMany({ wishlist: wishlist._id })
    next()
  }
)

const Wishlist = mongoose.model('Wishlist', wishlistSchema)

module.exports = Wishlist
