const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
   owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
   },
   item: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Item'
   },
   accountId: { type: String, required: true },
   type: { type: String, required: true },
   nickname: { type: String, required: true },
   name: { type: String, required: true },
   balance: { type: Number, required: true },
   needsUpdate: { type: Boolean, required: true, default: false }
})

const account = mongoose.model('Account', accountSchema)

module.exports = account