const applyFilters = (query) => {
   const filter = {}

   if (!query) return filter

   // Apply search
   if (query.search) {
      const re = new RegExp(query.search, 'i')
      // filter = { $text: { $search: query.search } }
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

   // Apply amount filter
   console.log(filter)
   return filter
}

module.exports = applyFilters