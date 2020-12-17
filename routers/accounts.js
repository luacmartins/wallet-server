const router = require('express').Router()
const Account = require('../models/account')

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