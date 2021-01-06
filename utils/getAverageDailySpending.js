const moment = require('moment')

const getAverageDailySpending = (transactions) => {
   const data = {}
   const allTime = moment().diff(transactions[transactions.length - 1].date.user, 'days')

   transactions.forEach(transaction => {
      category = transaction.category
      amount = transaction.amount / allTime

      if (category !== 'Transfer') {
         data[category] ? data[category] += amount : data[category] = amount
      }
   })
   return data
}

module.exports = getAverageDailySpending