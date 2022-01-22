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
          if (quiz.length === quiz_per_day && !runningQuiz) {
               res.json({ message: 'You\'re finished your quizes today!' })
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

               res.json({ data: { ...newQuiz._doc, words: quizWords.map(word => word._doc) } })
          } else {
               runningQuiz.words = runningQuiz.words.filter(({ is_answered }) => !is_answered)
               runningQuiz.words = runningQuiz.words.map(({ _doc }) => _doc.word._doc)
               res.send({ data: runningQuiz })
          }
     } catch (error) {
          console.log(error)
     }
})
router.patch('/answer', async (req, res, next) => {
     const { quiz_id, word_id } = req.body;
     if (!quiz_id || !word_id) {
          res.status(422).json({ errorMessage: 'quiz_id or word_id is missed' })
     }
     const { answer } = req.query
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
     const [quiz, word] = await Promise.all([
          Quiz.findOne({ $and: [{ _id: quiz_id }, {'words.word': {$elemMatch: [word_id]}}] }),
          // Quiz.findOne({ $and: [{ _id: quiz_id }, {'words.word': word_id}] }),
          Word.findOne({ user_id: req.user_id, _id: word_id }),
     ])
     // quiz.words[0] = { ...quiz.words[0], is_answered: true }
     console.log('=>', quiz)
     // => {
     //      _id: new ObjectId("61ec38e8aa15a208403055e5"),
     //      user_id: new ObjectId("61dc525d0f4044d2dd604947"),
     //      date: 2022-01-22T00:00:00.000Z,
     //      is_done: false,
     //      words: [
     //        {
     //          word: new ObjectId("61ddadc34adb428db22cfeee"),
     //          is_answered: false,
     //          _id: new ObjectId("61ec38e8aa15a208403055e6")
     //        },
     //        {
     //          word: new ObjectId("61ddad374adb428db22cfe81"),
     //          is_answered: false,
     //          _id: new ObjectId("61ec38e8aa15a208403055e7")
     //        }
     //      ],
     //      __v: 0
     //    }
     // word[nameOfKey] += 1
     // word.updated_date = `${new Date().toISOString().slice(0, 10)}`

     try {
          // const [, savedWord] = await Promise.all([
          //      quiz.save(),
          //      word.save(),
          // ])
          // res.json({ data: { success: true, _id: savedWord._id } })
     } catch (error) {
          console.log('=>', error.message)
     }
     // .then((r) => {
     //      console.log('=>', r)
     // })
     // .catch(err => next(err))
})


module.exports = router;