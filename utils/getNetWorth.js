const moment = require('moment')

const getNetWorth = async (accounts, transactions, numDays) => {
   // summary
   const amount = accounts.reduce((sum, acc) => sum += acc.balance, 0)

   // series
   const series = []
   let startAmount = amount

   for (let i = 0; i <= numDays; i++) {
      const date = moment().subtract(i, 'days').format('YYYY-MM-DD')
      const dailyTransactions = transactions.filter(item => item.date.user === date)
      const amount = dailyTransactions.reduce((sum, item) => sum += item.amount, startAmount)
      series.push({ date, amount })
      startAmount = amount
   }

   const change = amount - series.filter(item => item.date === moment().subtract(numDays, 'days').format('YYYY-MM-DD'))[0].amount

   return ({
      summary: {
         amount,
         change
      },
      series: series.reverse(),
      timeframe: [{ label: '3M' }, { label: '6M' }, { label: '1Y' }, { label: '3Y' }, { label: 'ALL' }]
   })
}

module.exports = getNetWorth