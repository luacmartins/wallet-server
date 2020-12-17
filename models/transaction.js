const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
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
   account: { type: String, required: true },
   transactionId: { type: String, required: true },
   pending: { type: Boolean, required: true },
   amount: { type: Number, required: true },
   description: {
      original: { type: String, required: true },
      user: { type: String },
   },
   date: {
      original: { type: String, required: true },
      user: { type: String, required: true }
   },
   category: { type: String, required: true }
})

const transaction = mongoose.model('Transaction', transactionSchema)

module.exports = transaction