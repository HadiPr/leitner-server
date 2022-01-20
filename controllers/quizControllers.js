const Quiz = require('../models/quiz.js')
const User = require('../models/user.js')
const Word = require('../models/word.js')

const router = require('express').Router()

router.get('/', async (req, res, next) => {
     const { user_id } = req
     try {
          let [{ setting }, quiz] = await Promise.all([
               User.findById(user_id),
               Quiz.find({ user_id, date: req.query.date }).populate('words.word', 'word definition'),
          ])
          const { quiz_per_day, countof_correct_answers_to_pass_word: maxTrueAnswers } = setting
          const today = new Date(req.query.date).toISOString().slice(0, 10)
          const runningQuiz = quiz.find(item => !item.is_done)?._doc
          if(quiz.length === quiz_per_day && !runningQuiz){
               res.json({message: 'You\'re finished your quizes today!'})
          }
          if (!runningQuiz) {
               //generate quiz
               const quizWords = await Word.find({
                    user_id: req.user_id,
                    countOfRightAnswers: { $lte: maxTrueAnswers },
               }, 'word definition').sort('-countOfWrongAnswers createdDate')
               let newQuiz = new Quiz({
                    user_id,
                    date: today,
                    words: quizWords.map(word => ({
                         word: word._id
                    }))
               })
               newQuiz = await newQuiz.save() 

               res.json({data: {...newQuiz._doc, words: quizWords.map(word => word._doc)}})
          } else {
               runningQuiz.words = runningQuiz.words.filter(({ is_answered }) => !is_answered)
               runningQuiz.words = runningQuiz.words.map(({ _doc }) => _doc.word._doc)
               res.send({ data: runningQuiz })
          }
     } catch (error) {
          console.log(error)
     }
})
router.patch('/answer/:id', (req, res, next) => {
     const { id } = req.params
     const today = new Date(req.query.date).toISOString().slice(0, 10)
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
          // const nthQuizInDay = +word.updatedDate.split('--')[1]
          word[nameOfKey] += 1
          if (today === word.updated_date) {
               word.daily_updates += 1
          } else {
               word.daily_updates = 1
          }
          word.updated_date = `${new Date().toISOString().slice(0, 10)}`

          return word.save()
     })
          .then((r) => {
               res.json({ data: { success: true, _id: r._id } })
          })
          .catch(err => next(err))
})


module.exports = router;