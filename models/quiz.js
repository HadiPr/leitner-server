const { model, Schema, Types } = require('mongoose');

const quizSchema = new Schema({
     user_id: {ref: 'user', type: Types.ObjectId},
     date: Date,
     is_done: { type: Boolean, default: false },
     words: [{
          word: { type: Types.ObjectId, ref: 'words' },
          is_answered: { type: Boolean, default: false },
     }],
})

const Quiz = model('quiz', quizSchema)

module.exports = Quiz