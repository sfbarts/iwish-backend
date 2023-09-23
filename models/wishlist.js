const mongoose = require('mongoose')

const wishlistSchema = new mongoose.Schema({
  name: { type: String },
  total: { type: Number, default: 0.0 },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
})

wishlistSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Wishlist = mongoose.model('Wishlist', wishlistSchema)

module.exports = Wishlist
