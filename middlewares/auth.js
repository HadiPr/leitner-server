const jwt = require('jsonwebtoken')
module.exports = function checkAuth(req, res, next) {
     try {
          const token = req.headers['x-auth-token']
          const {_id} = jwt.verify(token, 'hadisupersecretkey')
          req.user_id = _id
          next()
     } catch (error) {
          res.status(401).json({message: error.message ||'authenticated required'})
     }
}