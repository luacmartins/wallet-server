const moment = require('moment')

const getNumDays = (transactions, period) => {
   const today = moment()
   let startDate

   switch (period) {
      case 'MTD':
         startDate = moment().startOf('month').format('YYYY-MM-DD')
         break
      case 'YTD':
         startDate = moment().startOf('year').format('YYYY-MM-DD')
         break
      case 'ALL':
         const len = transactions.length
         startDate = transactions[len - 1].date.user
         break
      default:
         let [qty, unit] = period.split('')
         qty = parseInt(qty)
         unit === 'M' ? unit = 'months' : unit = 'years'
         startDate = moment().subtract(qty, unit).format('YYYY-MM-DD')
   }
   return today.diff(startDate, 'days')
}

module.exports = getNumDays