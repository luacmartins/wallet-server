const router = require('express').Router()
const client = require('../plaid/config')
const moment = require('moment')
const Item = require('../models/item')
const Account = require('../models/account')
const Transaction = require('../models/transaction')


router.get('/api/get-link-token', async (req, res) => {
   try {
      const tokenResponse = await client.createLinkToken({
         user: {
            client_user_id: req.user._id
         },
         client_name: 'Wallet',
         products: ['transactions'],
         country_codes: ['US'],
         language: 'en',
         webhook: 'https://webhook.sample.com'
      })
      res.send({ link_token: tokenResponse.link_token })
   } catch (error) {
      return res.send({ error: error.message })
   }
})

router.post('/api/get-access-token', async (req, res) => {
   try {
      const publicToken = req.body.token
      const response = await client.exchangePublicToken(publicToken)
      const data = await client.getAccounts(response.access_token)
      const item = new Item({
         owner: req.user._id,
         accessToken: response.access_token,
         itemId: response.item_id,
         accounts: data.accounts
      })
      await item.save()

      createAccounts(req.user._id, data.accounts, item)
      createTransactions(req.user._id, response.access_token, item)

      res.status(200).send()
   } catch (error) {
      return res.send({ error: error.message })
   }
})

router.delete('/api/accounts/:id', async (req, res) => {
   try {
      const account = await Account.findOne({ _id: req.params.id, owner: req.user._id })
      const item = await Item.findOne({ _id: account.item })
      await client.removeItem(item.accessToken)
      await Account.deleteMany({ item })
      await item.delete()
      res.status(200).send()
   } catch (error) {
      res.status(500).send(error)
   }
})

// Helper functions
const createAccounts = async (id, accounts, item) => {
   const lookup = {
      'depository': 'Cash',
      'credit': 'Credit_cards',
      'loan': 'Loans',
      'investment': 'Investments',
      'other': 'Other_assets'
   }

   accounts.forEach(async (account) => {
      let newAccount = new Account({
         owner: id,
         item,
         accountId: account.account_id,
         type: lookup[account.type],
         nickname: account.name,
         name: account.official_name || account.name,
         balance: account.balances.current,
         currency: account.iso_currency_code
      })
      await newAccount.save()
   })
}


const createTransactions = async (id, token, item) => {
   const dateStart = moment().subtract(10, 'day').format('YYYY-MM-DD')
   const dateEnd = moment().format('YYYY-MM-DD')

   const data = await client.getTransactions(token, dateStart, dateEnd, {})
   data.transactions.forEach(async el => {
      const account = await Account.findOne({ accountId: el.account_id })
      const transaction = new Transaction({
         owner: id,
         item: item._id,
         accountId: el.account_id,
         account: account.name,
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
         category: el.category[0]
      })
      await transaction.save()
   })
}


module.exports = router