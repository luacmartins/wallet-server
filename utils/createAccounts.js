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
      let newAccount = new Account({
         owner: id,
         item,
         accountId: account.account_id,
         type: lookup[account.type],
         nickname: account.name,
         name: account.official_name || account.name,
         balance: account.balances.current,
         currency: account.iso_currency_code
      })
      await newAccount.save()
   })
}

module.exports = createAccounts