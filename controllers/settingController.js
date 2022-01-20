const router = require('express').Router()
const User = require('../models/user')
router.get('/', async (req, res, next) => {
     try {
          const { setting } = await User.findById(req.user_id).select('-setting._id -setting.time_to_remind')
          res.json({data: setting})
     } catch (error) {
          next(error)
     }
})
router.patch('/', async (req, res, next)=> {
     try {
          const user = await User.findOne({user_id: req.user_id})
          user.setting.quiz_per_day = req.body.quiz_per_day
          user.setting.countof_correct_answers_to_pass_word = req.body.countof_correct_answers_to_pass_word
          res.json({message: 'profile setting has been updated', data: await user.save()})
     } catch (error) {
          next(error)
     }
})

module.exports = router