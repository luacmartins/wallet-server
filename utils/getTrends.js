const Item = require('../models/item')
const User = require('../models/user')
const Transaction = require('../models/transaction')

// import helper functions
const getCategorySpending = require('../utils/getCategorySpending')
const getNumDays = require('../utils/getNumDays')
const getAverageDailySpending = require('../utils/getAverageDailySpending')
const getOvertimeSpending = require('../utils/getOvertimeSpending')

const getTrends = async (itemId) => {
   const monthlyTimeframe = ['MTD', '1M', '6M', '1Y', 'YTD']
   const overtimeTimeframe = ['6M', '1Y', '2Y', '3Y', 'ALL']

   try {
      const item = await Item.findOne({ itemId })
      const user = await User.findOne({ _id: item.owner })
      // get avg spending data
      const transactions = await Transaction.find({ owner: user._id }, null, { sort: { 'date.user': -1 } })
      const averageDailySpending = getAverageDailySpending(transactions)
      const average = Object.keys(averageDailySpending).map(key => ({
         category: key,
         monthly: Math.abs(averageDailySpending[key] * 30),
         yearly: Math.abs(averageDailySpending[key] * 360)
      }))

      const data = {
         monthly: {},
         overtime: {},
         average
      }

      // get pie chart data
      const allTimeDate = user.dashboard.allTimeDate
      monthlyTimeframe.forEach(async period => {
         const { startDate: startDateMonthly, numDays } = getNumDays(period, allTimeDate)
         const monthly = await getCategorySpending(transactions, averageDailySpending, numDays, startDateMonthly)
         data.monthly[period] = monthly
      })

      // get overtime spending data
      overtimeTimeframe.forEach(period => {
         const { startDate: startDateOvertime } = getNumDays(period, allTimeDate)
         const overtime = getOvertimeSpending(transactions, startDateOvertime)
         data.overtime[period] = overtime
      })

      user.trends = data
      await user.save()
   } catch (error) {
      console.log(error)
   }
}

module.exports = getTrends