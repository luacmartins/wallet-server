const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      trim: true
   },
   parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
   },
   owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
   },
   canEdit: {
      type: Boolean,
      required: true,
      default: true
   }
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category