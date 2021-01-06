const router = require('express').Router()
const client = require('../plaid/config')
const Item = require('../models/item')
const Account = require('../models/account')
const Transaction = require('../models/transaction')

// import helper functions
const getAccountTypeSummary = require('../utils/getAccountTypeSummary.js')
const getDashboardTransactions = require('../utils/getDashboardTransactions')
const getNetWorth = require('../utils/getNetWorth')
const getNumDays = require('../utils/getNumDays')

router.get('/api/dashboard', async (req, res) => {
   try {
      // needs to update account balances every day!!!

      // Accounts summary
      const accounts = await Account.find({ owner: req.user._id })
      const transactions = await Transaction.find({ owner: req.user._id })
      const accountsSummary = getAccountTypeSummary(accounts)

      // Latest transactions
      const dashboardTransactions = await getDashboardTransactions(req.user._id)

      // Net Worth
      const numDays = getNumDays(transactions, req.query.period)
      const networth = await getNetWorth(accounts, transactions, numDays)

      const data = {
         accounts: accountsSummary,
         transactions: dashboardTransactions,
         networth
      }

      res.status(200).send(data)
   } catch (error) {
      console.log(error)
      res.status(400).send({ error })
   }
})

module.exports = router