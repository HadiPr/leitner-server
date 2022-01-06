const express = require('express')
const app = express()

const helmet = require('helmet')
const cors = require('cors')
const authMiddleware = require('./middlewares/auth')
const { connectDb } = require('./helpers.js')
const wordRoutes = require('./controllers/wordControllers')
const quizRoutes = require('./controllers/quizControllers')
const userRoutes = require('./controllers/userController')

app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}))
app.use(express.json())
app.use(helmet())

app.use((req, res, next) => {
  require('fs').appendFileSync(__dirname + '/test.log' , `${new Date().toISOString()} => ${req.method} => ${req.path} \n`)
  // res.end()
  next()
})



const router = express.Router()
router.use('/word',authMiddleware, wordRoutes)
router.use('/quiz',authMiddleware, quizRoutes)
router.use('/auth', userRoutes)

app.use('/api', router)

app.use((req, res)=> res.status(404).json({errorMessage: 'page not found'}))

app.use((error, req, res, next) => {
  console.log(error.statusCode)
  res.status(error.statusCode || 500).json({ errorMessage: error.message })
})



app.listen(process.env.PORT, () => {
  console.log('Server is running')
  connectDb()
})
