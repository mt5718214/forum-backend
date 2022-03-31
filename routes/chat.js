const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  console.log("it's chat now")
  return res.send(new Date())
})

module.exports = router