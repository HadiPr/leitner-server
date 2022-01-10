const { model, Schema } = require('mongoose');

const userSchema = new Schema({
     username: String,
     password: String,
     setting: {
          type: {
               quiz_per_day: { type: Number, default: 1 },
               countof_correct_answers_to_pass_word: { type: Number, default: 10 },
               time_to_remind: {
                    hour: { type: Number, default: 9 },
                    minute: { type: Number, default: 0 }
               },
          },
          default: {},
     }
})

const userModel = model('users', userSchema)

module.exports = userModel
