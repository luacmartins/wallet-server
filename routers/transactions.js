const router = require('express').Router()
const Transaction = require('../models/transaction')


router.get('/api/transactions', async (req, res) => {
   try {
      const transactions = await Transaction.find({ owner: req.user._id })
      const data = { 'pending': [], 'posted': [] }
      transactions.forEach(item => {
         if (item.pending) data['pending'].push(item)
         else data['posted'].push(item)
      })
      res.status(200).send(data)
   } catch (error) {
      res.status(500).send()
   }
})

module.exports = router