const router = require('express').Router()
const client = require('../plaid/config')
const Item = require('../models/item')
const Account = require('../models/account')


// ITEM router to add new Institution
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

      const lookup = {
         'depository': 'Cash',
         'credit': 'Credit_cards',
         'loan': 'Loans',
         'investment': 'Investments',
         'other': 'Other_assets'
      }

      data.accounts.forEach(async (account) => {
         let newAccount = new Account({
            owner: req.user._id,
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

   } catch (error) {
      return res.send({ error: error.message })
   }
})

// Account routes
router.get('/api/accounts', async (req, res) => {
   try {
      const accounts = await Account.find({ owner: req.user._id })
      const data = {}
      accounts.forEach(account => {
         data[account.type] ? data[account.type].push(account) : data[account.type] = [account]
      })
      const sortedData = Object.keys(data).sort().reduce((obj, key) => (obj[key] = data[key], obj), {})
      res.status(200).send(sortedData)
   } catch (error) {
      res.status(500).send({ error })
   }
})

router.patch('/api/accounts/:id', async (req, res) => {
   try {
      const account = await Account.findOne({ _id: req.params.id, owner: req.user._id })
      if (!account) res.status(404).send('No account found')
      account.nickname = req.body.nickname
      account.type = req.body.type
      await account.save()
      res.status(200).send()
   } catch (error) {
      res.status(500).send({ error })
   }
})

module.exports = router