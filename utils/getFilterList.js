const Category = require('../models/category')
const Account = require('../models/account')

const getFilterList = async (id) => {
   const categories = await Category.find({ owner: id })
   const accounts = await Account.find({ owner: id })

   const list = [{
      name: 'Account type',
      field: 'accountType',
      options: [
         { label: 'Cash', name: 'Cash' },
         { label: 'Credit Card', name: 'Credit_cards' },
         { label: 'Investment', name: 'Investments' },
         { label: 'Loan', name: 'Loans' },
         { label: 'Other assets', name: 'Other_assets' },
      ]
   }, {
      name: 'Account',
      field: 'account',
      options: accounts.map(acc => ({ label: acc.nickname, name: acc.name }))
   }, {
      name: 'Category',
      field: 'category',
      options: categories.map(cat => ({ label: cat.name, name: cat.name }))
   }]

   return list
}

module.exports = getFilterList