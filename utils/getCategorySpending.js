const getCategorySpending = async (allTransactions, averageDailySpending, numDays, startDate) => {
   const data = {}
   const transactions = allTransactions.filter(transaction => transaction.date.user >= startDate)

   let category, amount

   transactions.forEach(transaction => {
      category = transaction.category
      amount = transaction.amount

      if (category !== 'Transfer') {
         data[category] ? data[category] += amount : data[category] = amount
      }
   })
   const series = Object.keys(data).map(key => ({ category: key, amount: Math.abs(data[key]) }))
   const periodTotal = Object.values(data).reduce((sum, item) => sum += item, 0)
   const total = Object.values(averageDailySpending).reduce((sum, item) => sum += item * numDays, 0)
   const percent = Math.round((periodTotal / total - 1) * 100)

   return {
      summary: {
         total: Math.abs(total),
         percent
      },
      series,
      timeframe: [{ label: 'MTD' }, { label: '1M' }, { label: '6M' }, { label: '1Y' }, { label: 'YTD' }]
   }
}

module.exports = getCategorySpending