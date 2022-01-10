const router = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const checkAuth = require('../middlewares/auth')
const { errorMaker } = require('../helpers.js')

router.post('/signup', async (req, res, next) => {
     const { username, password, confirm_password, ...others } = req.body || {}
     if (!Object.keys(others))
          res.status(422).json({hasError: true})
     if(password !== confirm_password){
          res.status(422).json({hasError: true, errorMessage: 'Password dosnn\'t match confirm password'})
     }
     try {
          const user = await User.findOne({username})
          if(user){
               return next(errorMaker('This username already exist!', 409))
          } 
     } catch (err) {
          return next(err)
     }
     const user = new User({username, password})
     user.save().then((user) => res.json({ success: true, data: { user } }))
 })
router.post('/login', (req, res, next) => {
     let {username, password} = req.body || {}
     username = username.trim()
     User.findOne({username}).then(user => {
          if(!user){
               res.status(404).json({errorMessage: 'user not found'})
          }
          if(password === user.password){
               const token = jwt.sign({_id: user._id}, 'hadisupersecretkey', {expiresIn: 60 * 60 * 24 * 7})
               res.json({data: {token}})
          } else {
               return next(new Error('user not found'));
          }
     })
 })
router.post('/check', checkAuth, (req, res, next) => {
     res.json({data: {success: true}})
})

module.exports = router