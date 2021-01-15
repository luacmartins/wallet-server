const Item = require('../models/item')
const User = require('../models/user')
const Account = require('../models/account')
const Transaction = require('../models/transaction')

// import helper functions
const getAccountTypeSummary = require('../utils/getAccountTypeSummary.js')
const getDashboardTransactions = require('../utils/getDashboardTransactions')
const getNetWorth = require('../utils/getNetWorth')
const getPeriod = require('../utils/getPeriod')

const getDashboard = async (itemId) => {
   try {
      // Accounts summary
      const item = await Item.findOne({ itemId })
      const user = await User.findOne({ _id: item.owner })
      const accounts = await Account.find({ owner: user._id })
      const transactions = await Transaction.find({ owner: user._id }, null, { sort: { 'date.user': -1 } })
      const accountsSummary = getAccountTypeSummary(accounts)

      // Latest transactions
      const dashboardTransactions = getDashboardTransactions(transactions)

      // Net Worth
      const { numDays, allTimeDate } = getPeriod(transactions)
      const networth = await getNetWorth(accounts, transactions, numDays)

      const data = {
         accounts: accountsSummary,
         transactions: dashboardTransactions,
         networth,
         allTimeDate
      }

      user.dashboard = data
      await user.save()

   } catch (error) {
      console.log(error)
   }
}

module.exports = getDashboard