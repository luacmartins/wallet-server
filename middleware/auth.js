const jwt = require('jsonwebtoken')
const User = require('../models/user')

const publicRoutes = ['/api/login', '/api/signup']

const auth = async (req, res, next) => {
   try {
      // login/signup/reset-password do not require jwt verification
      if (publicRoutes.includes(req.path)) {
         return next()
      }
      // get token from request header Authorization
      const token = req.headers.authorization
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

      if (!user) throw new Error('Unauthorized')
      req.token = token
      req.user = user
      next()
   } catch (err) {
      // Catch the JWT Expired or Invalid errors
      return res.status(401).json({ message: 'Unauthorized' })
   }
}

module.exports = auth