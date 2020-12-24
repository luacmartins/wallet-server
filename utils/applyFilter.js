const applyFilters = (query) => {
   const filter = {}

   if (!query) return filter

   // Apply search
   if (query.search) {
      const re = new RegExp(query.search, 'i')
      filter['description.user'] = re
   }

   // Apply selection filter
   const selection = ['account', 'accountType', 'category']
   const keys = Object.keys(query)
   keys.forEach(key => {
      if (selection.includes(key)) {
         const values = query[key].split(',')
         filter[key] = { $nin: values }
      }
   })

   // Apply date filter
   if (query.startDate) {
      filter['date.user'] = { $gte: query.startDate }
   }

   if (query.endDate) {
      filter['date.user'] = { ...filter['date.user'], $lte: query.endDate }
   }

   // Apply amount filter
   if (query.minAmount) {
      filter['amount'] = { $gte: query.minAmount }
   }

   if (query.maxAmount) {
      filter['amount'] = { ...filter['amount'], $lte: query.maxAmount }
   }

   return filter
}

module.exports = applyFilters