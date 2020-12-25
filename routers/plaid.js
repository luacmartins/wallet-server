const router = require('express').Router()
const client = require('../plaid/config')
const Item = require('../models/item')
const Account = require('../models/account')

const createAccounts = require('../utils/createAccounts')
const createAndUpdateTransactions = require('../utils/createAndUpdateTransactions')
const deleteTransactions = require('../utils/deleteTransactions')

// LINK ITEM ROUTES
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
         webhook: process.env.WEBHOOK_URL
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


// WEBHOOK ROUTE
router.post('/api/webhook', async (req, res) => {
   try {
      const { webhook_type: asset, webhook_code: code, item_id: itemId } = req.body

      if (asset === 'ITEM') {
         switch (code) {
            case 'ERROR':
               console.log('error')
            case 'PENDING_EXPIRATION':
               console.log('error')
            case 'USER_PERMISSION_REVOKED':
               console.log('error')
            default:
               break
         }
      }

      if (asset === 'TRANSACTIONS') {
         const count = req.body.new_transactions
         switch (code) {
            case 'INITIAL_UPDATE':
               createAndUpdateTransactions(itemId, count)
               break
            case 'HISTORICAL_UPDATE':
               createAndUpdateTransactions(itemId, count)
               break
            case 'DEFAULT_UPDATE':
               createAndUpdateTransactions(itemId, count)
            case 'TRANSACTIONS_REMOVED':
               const removedTransactions = req.body.removed_transactions
               deleteTransactions(itemId, removedTransactions)
            default:
               break
         }
      }
      res.status(200).send()
   } catch (error) {
      console.log(error)
      res.status(500).send()
   }
})

module.exports = router