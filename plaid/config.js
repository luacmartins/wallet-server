const plaid = require('plaid')

const client = new plaid.Client({
   clientID: process.env.PLAID_CLIENT_ID,
   secret: process.env.PLAID_SECRET,
   env: plaid.environments.sandbox
})

module.exports = client