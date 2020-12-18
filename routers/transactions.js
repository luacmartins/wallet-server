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

router.patch('/api/transactions/:id', async (req, res) => {
   try {
      const id = req.params.id
      await Transaction.findOneAndUpdate({ owner: req.user._id, _id: id }, req.body)
      res.status(200).send()
   } catch (error) {
      res.status(500).send()
   }
})

module.exports = router