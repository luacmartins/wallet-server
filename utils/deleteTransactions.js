const Item = require('../models/item')
const Transaction = require('../models/transaction')

const deleteTransactions = async (itemId, removedTransactions) => {
   const item = await Item.findOne({ itemId })
   const id = item._id

   removedTransactions.forEach(async (transactionId) => {
      await Transaction.findOneAndDelete({ item: id, transactionId })
   })
}

module.exports = deleteTransactions