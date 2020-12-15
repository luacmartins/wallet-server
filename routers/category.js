const router = require('express').Router()
const Category = require('../models/category')


// Create category route
router.post('/api/category', async (req, res) => {
   try {
      const category = new Category({
         ...req.body,
         owner: req.user._id
      })
      await category.save()
      res.status(201).send()
   } catch (error) {
      res.status(404).send(error)
   }
})

// Read all categories
router.get('/api/category', async (req, res) => {
   try {
      const data = await Category.find({ owner: req.user._id })
      res.status(200).send(data)
   } catch (error) {
      res.status(404).send(error)
   }
})

// Update category
router.patch('/api/category/:id', async (req, res) => {
   try {
      const { name } = req.body
      const category = await Category.findOne({ _id: req.params.id, owner: req.user._id })

      if (!category) res.status(404).send('No category found')
      category.name = name
      await category.save()
      res.status(200).send()
   } catch (error) {
      res.status(404).send(error)
   }
})

// Delete category
router.delete('/api/category/:id', async (req, res) => {
   try {
      const category = await Category.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
      category ? res.status(200).send() : res.status(404).send('No category found!')
   } catch (error) {
      res.status(500).send()
   }
})

module.exports = router
