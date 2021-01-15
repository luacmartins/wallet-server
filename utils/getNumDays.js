const moment = require('moment')

const getNumDays = (period, allTimeDate) => {
   let startDate

   switch (period) {
      case 'MTD':
         startDate = moment().startOf('month').format('YYYY-MM-DD')
         break
      case 'YTD':
         startDate = moment().startOf('year').format('YYYY-MM-DD')
         break
      case 'ALL':
         startDate = allTimeDate
         break
      default:
         let [qty, unit] = period.split('')
         qty = parseInt(qty)
         unit === 'M' ? unit = 'months' : unit = 'years'
         startDate = moment().subtract(qty, unit).format('YYYY-MM-DD')
   }
   return { startDate, numDays: moment().diff(startDate, 'days') }
}

module.exports = getNumDays