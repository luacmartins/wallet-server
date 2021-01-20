const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const createDefaultCategories = require('../utils/createDefaultCategories')

// Sign up route
router.post('/api/signup', async (req, res) => {
   try {
      const user = new User(req.body)
      await user.save()
      createDefaultCategories(user._id)
      const token = await user.generateAuthToken()
      if (!token) throw new Error('Unable to sign up.')
      res.status(201).json({ user: user.name, token })
   } catch (error) {
      res.status(400).send({ error: error.message })
   }
})

// Login route
router.post('/api/login', async (req, res) => {
   try {
      const { email, password } = req.body
      const user = await User.authenticate(email, password)
      const token = await user.generateAuthToken()
      if (!user) throw new Error('Could not login')
      res.send({ user: user.name, token })
   } catch (error) {
      res.status(400).send({ error: error.message })
   }
})

// Logout route
router.get('/api/logout', async (req, res) => {
   try {
      // req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
      req.user.tokens = []
      await req.user.save()
      res.send()
   } catch (error) {
      res.status(400).send()
   }
})

// Change password
router.patch('/api/change-password', async (req, res) => {
   try {
      const { currentPassword, newPassword } = req.body
      const isMatch = await bcrypt.compare(currentPassword, req.user.password)
      if (!isMatch) throw new Error('Your current password is incorrect.')
      req.user.password = newPassword
      await req.user.save()
      res.status(200).send()
   } catch (error) {
      res.status(401).send({ error: error.message })
   }
})

// add delete user account

module.exports = router