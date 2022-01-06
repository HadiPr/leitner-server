const Word = require('../models/word.js')

const router = require('express').Router()

router.get('/', (req, res, next) => {
     Word.find({ user_id: req.user_id, countOfRightAnswers: { $lte: 13 }})
     .sort('-countOfWrongAnswers createdDate')
          .then(words => res.json({ 
               data: words.filter(item => item.updatedDate !== new Date().toISOString().slice(0,10)) 
          }))
          .catch(err => next(err))
})
router.patch('/answer/:id', (req, res, next) => {
     const { id } = req.params
     const { answer } = req.query
     if (!id) res.status(400).json({ errorMessage: 'id not found' })
     if (!answer) res.status(400).json({ errorMessage: 'specify answer in query => ?answer=true' })
     let nameOfKey;
     switch (answer) {
          case 'true':
               nameOfKey = 'countOfRightAnswers'
               break;
          case 'false':
               nameOfKey = 'countOfWrongAnswers'
               break;
     }
     Word.findOne({ user_id: req.user_id, _id: id }).then(word => {
          word[nameOfKey] += 1
          word.updatedDate = new Date().toISOString().slice(0, 10)
          return word.save()
     })
          .then((r) => {
               res.json({data: { success: true , _id: r._id}})
          })
          .catch(err => next(err))
})


module.exports = router;