const router = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const checkAuth = require('../middlewares/auth')

router.post('/signup', async (req, res, next) => {
     const {username, password} = req.body
     try {
          const user = await User.findOne({username})
          if(user) return next(new Error('کاربری با این مشخصات موجود است'))
     } catch (err) {
          return next(err)
     }
     const user = new User({username, password})
     user.save().then(()=> res.json({success: true}))
 })
router.post('/login', (req, res, next) => {
     const {username, password} = req.body
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
     res.json({success: true})
})

module.exports = router