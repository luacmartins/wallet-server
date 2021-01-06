const getAccountTypeSummary = (accounts) => {
   const accountTypes = ['Cash', 'Credit_cards', 'Investments', 'Loans', 'Other_assets']
   const balances = []

   accountTypes.forEach(type => {
      const balance = accounts.reduce((sum, acc) => {
         if (type === acc.type) sum += acc.balance
         return sum
      }, 0)

      if (balance !== 0) balances.push({ type, balance })
   })

   return balances
}

module.exports = getAccountTypeSummary