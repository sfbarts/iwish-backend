const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
  name: { type: String, maxLength: 100 },
  url: { type: String, maxLength: 400 },
  price: { type: Number, default: 0.0 },
  acquired: { type: Boolean, default: false },
  wishlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wishlist',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})

itemSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Item = mongoose.model('Item', itemSchema)

module.exports = Item
