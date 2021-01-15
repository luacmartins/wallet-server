const router = require('express').Router()

router.get('/api/trends', async (req, res) => {
   try {
      const data = req.user.trends
      data.monthly = data.monthly[req.query.monthlyPeriod]
      data.overtime = data.overtime[req.query.overtimePeriod]
      res.status(200).send(req.user.trends)
   } catch (error) {
      console.log(error)
      res.status(400).send({ error })
   }
})

module.exports = router