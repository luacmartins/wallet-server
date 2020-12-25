const router = require('express').Router()
const Transaction = require('../models/transaction')
const applyFilter = require('../utils/applyFilter')
const getFilterList = require('../utils/getFilterList')

router.get('/api/transactions/', async (req, res) => {
   try {
      const filter = applyFilter(req.query)
      const transactions = await Transaction.paginate({ owner: req.user._id, ...filter }, { limit: 30, page: req.query.page, sort: { 'date.user': -1 } })

      const data = { 'pending': [], 'posted': [] }
      transactions.docs.forEach(item => {
         if (item.pending) data['pending'].push(item)
         else data['posted'].push(item)
      })

      res.set('x-total-pages', transactions.totalPages)
      res.set('Access-Control-Expose-Headers', 'x-total-pages')
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

// get filters
router.get('/api/filters', async (req, res) => {
   try {
      const list = await getFilterList(req.user._id)
      res.status(200).send(list)
   } catch (error) {

   }
})


module.exports = router