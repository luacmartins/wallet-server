const Transaction = require('../models/transaction')

const getDashboardTransactions = async (owner) => {
   const pending = await Transaction.find({ owner, pending: true }).limit(5)
   const posted = await Transaction.find({ owner, pending: false }).limit(5)
   return ({ pending, posted })
}

module.exports = getDashboardTransactions