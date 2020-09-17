const theExpress = require('express'),
  Router = theExpress.Router(),
  {
    register,
    login
  } = require('../controller/auth'),
  {
    protect
  } = require('../middleware/auth')

Router.post("/register", register)
Router.post('/login', protect, login)

module.exports = Router