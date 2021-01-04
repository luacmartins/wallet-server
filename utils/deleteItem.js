const client = require('../plaid/config')
const Item = require('../models/item')

const deleteItem = async (itemId) => {
   try {
      const item = await Item.findOne({ itemId })
      await client.removeItem(item.accessToken)
      await item.delete()
   } catch (error) {
      throw new Error('Unable to delete item')
   }
}

module.exports = deleteItem