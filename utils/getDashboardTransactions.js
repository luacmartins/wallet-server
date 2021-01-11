const getDashboardTransactions = (owner, transactions) => {
   const max = transactions.slice(0, 10)
   const pending = max.filter(item => item.pending).slice(0, 5)
   const posted = max.filter(item => !item.pending).slice(0, 5)
   return ({ pending, posted })
}

module.exports = getDashboardTransactions