const router = require('express').Router()

router.get('/api/trends', async (req, res) => {
   try {
      res.status(200).send(req.user.trends)
   } catch (error) {
      console.log(error)
      res.status(400).send({ error })
   }
})

module.exports = router