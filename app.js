const express = require('express')
const app = express()

const helmet = require('helmet')
const authMiddleware = require('./middlewares/auth')
const { connectDb } = require('./helpers.js')
const wordRoutes = require('./controllers/wordControllers')
const quizRoutes = require('./controllers/quizControllers')
const userRoutes = require('./controllers/userController')

app.use(express.json())
app.use(helmet())


const router = express.Router()
router.use('/word',authMiddleware, wordRoutes)
router.use('/quiz',authMiddleware, quizRoutes)
router.use('/auth', userRoutes)

app.use('/api', router)

app.use((error, req, res, next) => {
  res.status(500).json({ errorMessage: error.message })
})



app.listen(process.env.PORT, () => {
  console.log('Server is running')
  connectDb()
})
