const router = require('express').Router()
const Word = require('../models/word')
const { getDefinition } = require('../helpers')


router.get('/default-definition/:word', (req, res, next) => {
     getDefinition(req.params.word).then((def) => res.json({data: def})).catch(err =>  next(err))
})
router.post('/', async (req, res, next) => {
     let { word, definition, defaultDefinition } = req.body
     if (!definition && !defaultDefinition) {
          try {
               definition = await getDefinition(word)
          } catch (error) {
               next(error)
          }
     }
     const newWord = new Word({
          user_id: req.user_id,
          word,
          definition: definition || defaultDefinition,
     })
     newWord.save().then(word => res.json({ data: word })).catch(err => next(err))
})

router.get('/', (req, res, next) => {
     Word.find({user_id: req.user_id}).then(words => res.json({ data: words })).catch(err => next(err))
})


module.exports = router