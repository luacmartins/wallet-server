const Item = require('../models/item')
const Account = require('../models/account')

const updateItem = async ({ item, itemId, needsUpdate }) => {
   try {
      let updateItem = item
      if (!item) {
         updateItem = await Item.findOne({ itemId })
      }
      updateItem.needsUpdate = needsUpdate
      await updateItem.save()
      const accounts = await Account.find({ item: updateItem._id })
      accounts.forEach(async account => {
         account.needsUpdate = needsUpdate
         await account.save()
      })
   } catch (error) {
      throw new Error('Unable to find item.')
   }
}

module.exports = updateItem