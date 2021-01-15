const moment = require('moment')

const getNumDays = (transactions) => {
   const allTimeDate = transactions[transactions.length - 1].date.user
   const threeYears = moment().subtract(3, 'years').format('YYYY-MM-DD')
   let startDate
   allTimeDate < threeYears ? startDate = allTimeDate : startDate = threeYears

   return { numDays: moment().diff(startDate, 'days'), allTimeDate }
}

module.exports = getNumDays