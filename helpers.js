const axios = require('axios');
const mongoose = require('mongoose')

function getDefinition(word) {
     const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fa&hl=en-US&dt=t&dt=bd&dj=1&q=${word}`
     return axios.get(url).then(({ data }) => data.sentences[0].trans)
}

function connectDb(callback = () => { }) {
     const db_url = process.env.NODE_ENV !== 'production' ? 'mongodb://localhost:27017/dict'
          : `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.baiai.mongodb.net/lef?retryWrites=true&w=majority`
     mongoose.connect(db_url)
          .then(() => {
               console.log('mongo is successfully connected...')
               callback()
          })
          .catch(e => console.log(e.message))

}
function errorMaker(message, code = 500) {
     const err = new Error(message)
     err.statusCode = code;
     return err
}

module.exports = {
     getDefinition,
     connectDb,
     errorMaker,
}