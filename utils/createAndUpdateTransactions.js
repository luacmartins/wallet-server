const moment = require('moment')
const client = require('../plaid/config')
const Item = require('../models/item')
const Account = require('../models/account')
const Transaction = require('../models/transaction')

const mapCategories = {
   'Bank Fees': 'Miscellanea',
   'Cash Advance': 'Miscellanea',
   'Community': 'Miscellanea',
   'Food and Drink': 'Food and Drink',
   'Healthcare': 'Health',
   'Interest': 'Miscellanea',
   'Payment': 'Transfer',
   'Recreation': 'Entertainment',
   'Service': 'Housing',
   'Shops': 'Shopping',
   'Tax': 'Miscellanea',
   'Transfer': 'Transfer',
   'Travel': 'Travel'
}

const createAndUpdateTransactions = async (itemId, count) => {
   const startDate = moment().subtract(3, 'years').format('YYYY-MM-DD')
   const endDate = moment().format('YYYY-MM-DD')
   const item = await Item.findOne({ itemId })
   const { owner, accessToken } = item

   const data = await client.getTransactions(accessToken, startDate, endDate, { count })
   data.transactions.forEach(async el => {
      const account = await Account.findOne({ accountId: el.account_id })

      const query = { transactionId: el.transaction_id }
      const options = { upsert: true, setDefaultsOnInsert: true }
      const update = {
         owner: owner._id,
         item: item._id,
         accountId: el.account_id,
         account: account.name,
         accountType: account.type,
         transactionId: el.transaction_id,
         pending: el.pending,
         amount: -el.amount,
         description: {
            original: el.name,
            user: el.name,
         },
         date: {
            original: el.date,
            user: el.date
         },
         category: mapCategories[el.category[0]]
      }

      await Transaction.findOneAndUpdate(query, update, options)
   })
}

module.exports = createAndUpdateTransactions