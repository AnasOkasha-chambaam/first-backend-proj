const theExpress = require('express'),
  Router = theExpress.Router(),
  {
    register,
    login,
    getMe,
    resetUserPassword
  } = require('../controller/auth'),
  {
    protect
  } = require('../middleware/auth')

Router.post("/register", register)
Router.post('/login', login)
Router.post('/getMe', protect, getMe)
Router.post('/resetpassword', resetUserPassword)

module.exports = Router