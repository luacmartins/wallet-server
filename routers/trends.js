const router = require('express').Router()
const Account = require('../models/account')
const Transaction = require('../models/transaction')

// import helper functions
const getCategorySpending = require('../utils/getCategorySpending')
const getNumDays = require('../utils/getNumDays')
const getAverageDailySpending = require('../utils/getAverageDailySpending')
const getOvertimeSpending = require('../utils/getOvertimeSpending')

router.get('/api/trends', async (req, res) => {
   try {
      // get avg spending data
      const transactions = await Transaction.find({ owner: req.user._id })
      const averageDailySpending = getAverageDailySpending(transactions)
      const average = Object.keys(averageDailySpending).map(key => ({
         category: key,
         monthly: Math.abs(averageDailySpending[key] * 30),
         yearly: Math.abs(averageDailySpending[key] * 360)
      }))

      // get pie chart data
      const [monthlyNumDays, startDateMonthly] = getNumDays(req.query.monthlyPeriod, transactions)
      const monthly = await getCategorySpending(transactions, averageDailySpending, monthlyNumDays, startDateMonthly)

      // get overtime spending data
      const [, startDateOvertime] = getNumDays(req.query.overtimePeriod, transactions)
      const overtime = getOvertimeSpending(transactions, startDateOvertime)

      const data = {
         monthly,
         average,
         overtime
      }

      res.status(200).send(data)

   } catch (error) {
      console.log(error)
      res.status(400).send({ error })
   }
})

module.exports = router