const Account = require('../models/account')

const lookup = {
   'depository': 'Cash',
   'credit': 'Credit_cards',
   'loan': 'Loans',
   'investment': 'Investments',
   'other': 'Other_assets'
}

const createAccounts = async (id, accounts, item) => {
   accounts.forEach(async (account) => {
      const type = lookup[account.type]
      const balance = type === 'Credit_cards' || type === 'Loans' ? -account.balances.current : account.balances.current
      const newAccount = new Account({
         owner: id,
         item,
         accountId: account.account_id,
         type,
         nickname: account.name,
         name: account.official_name || account.name,
         balance,
         currency: account.iso_currency_code
      })
      await newAccount.save()
   })
}

module.exports = createAccounts