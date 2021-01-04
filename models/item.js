const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
   owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
   },
   accessToken: {
      type: String,
      required: true,
      unique: true
   },
   itemId: {
      type: String,
      required: true,
      unique: true
   },
   needsUpdate: {
      type: Boolean,
      required: true,
      default: false
   }
})

const item = mongoose.model('Item', itemSchema)

module.exports = item