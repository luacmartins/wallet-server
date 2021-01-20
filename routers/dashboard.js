const router = require('express').Router()

// import helper functions
const getNumDays = require('../utils/getNumDays')

router.get('/api/dashboard', async (req, res) => {
   try {
      const data = req.user.dashboard
      if (!data) return res.status(200).send()

      const { startDate } = getNumDays(req.query.period, data.allTimeDate)
      const series = data.networth.series.filter(item => item.date > startDate)
      data.networth.series = series

      res.status(200).send(data)
   } catch (error) {
      console.log(error)
      res.status(400).send({ error })
   }
})

module.exports = router