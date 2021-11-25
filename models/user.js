const { model, Schema } = require('mongoose');

const userSchema = new Schema({
     username: String,
     password: String,
})

const userModel = model('users', userSchema)

module.exports = userModel
