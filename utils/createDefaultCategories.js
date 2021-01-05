const Category = require('../models/category')

const defaultCategories = [
   'Housing',
   'Food and Drink',
   'Transportation',
   'Entertainment',
   'Shopping',
   'Health',
   'Education',
   'Travel',
   'Transfer',
   'Miscellanea',
   'Uncategorized'
]

const createDefaultCategories = async (userId) => {
   defaultCategories.forEach(async name => {
      let category = new Category({
         name,
         owner: userId,
         canEdit: false
      })
      await category.save()
   })
}

module.exports = createDefaultCategories