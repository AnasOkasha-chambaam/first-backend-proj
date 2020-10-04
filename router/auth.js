const theExpress = require('express'),
  Router = theExpress.Router(),
  {
    register,
    login,
    getMe,
    resetUserPassword,
    resetPassFromToken,
    editDetails,
    editPassword
  } = require('../controller/auth'),
  {
    protect
  } = require('../middleware/auth')

Router.post("/register", register)
Router.post('/login', login)
Router.post('/getMe', protect, getMe)
Router.post('/resetpassword', resetUserPassword)
Router.put('/resetpassword/:resettoken', resetPassFromToken)
Router.put('/editdetails', protect, editDetails)
Router.put('/editpassword', protect, editPassword)

module.exports = Router