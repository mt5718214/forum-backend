import express from 'express'
const router = express.Router()

router.get('/', (_req, res, _next) => {
  console.log("it's chat now")
  return res.send(new Date())
})

export default router