const moment = require('moment')

const getOvertimeSpending = (transactions, startDate) => {
   // series of monthly spending
   const numMonths = moment().diff(startDate, 'months')

   let startOfMonth, endOfMonth, monthlyTransactions, spending
   const series = []
   const categoriesSet = new Set()
   for (let i = 1; i < numMonths + 1; i++) {
      startOfMonth = moment().subtract(i, 'months').startOf('month').format('YYYY-MM-DD')
      endOfMonth = moment().subtract(i, 'months').endOf('month').format('YYYY-MM-DD')
      monthlyTransactions = transactions.filter(item => item.date.user >= startOfMonth && item.date.user <= endOfMonth)

      spending = {
         date: endOfMonth
      }

      monthlyTransactions.forEach(item => {
         if (item.category !== 'Transfer') {
            categoriesSet.add(item.category)
            spending[item.category] ? spending[item.category] += item.amount : spending[item.category] = item.amount
         }
      })

      Object.keys(spending).forEach(key => {
         if (key !== 'date') {
            spending[key] = Math.abs(spending[key])
         }
      })

      series.push(spending)
   }
   const categories = Array.from(categoriesSet)

   // summary
   const endSpending = series[0]
   const startSpending = series[series.length - 1]
   const startTotal = Object.values(startSpending).slice(1).reduce((sum, item) => sum += item, 0)
   const endTotal = Object.values(endSpending).slice(1).reduce((sum, item) => sum += item, 0)

   const change = endTotal - startTotal

   const data = {
      summary: {
         change,
         startDate
      },
      series: {
         categories,
         series: series.reverse()
      },
      timeframe: [{ label: '6M' }, { label: '1Y' }, { label: '2Y' }, { label: '3Y' }, { label: 'ALL' }]
   }

   return data
}

module.exports = getOvertimeSpending