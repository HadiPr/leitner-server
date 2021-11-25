const { model, Schema, Types } = require('mongoose');

const wordSchema = new Schema({
     word: String,
     definition: String,
     countOfRightAnswers: {type: Number, default: 0},
     countOfWrongAnswers: {type: Number, default: 0},
     createdDate: {type: Number, default: Date.now()},
     updatedDate: String,
     user_id: Types.ObjectId,
})

const wordModel = model('words', wordSchema)

module.exports = wordModel