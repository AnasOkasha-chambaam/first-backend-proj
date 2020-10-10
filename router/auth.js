const theExpress = require('express'),
  Router = theExpress.Router(),
  {
    register,
    login,
    getMe,
    resetUserPassword,
    resetPassFromToken,
    editDetails,
    editPassword,
    logOut
  } = require('../controller/auth'),
  {
    protect
  } = require('../middleware/auth')

Router.post("/register", register)
Router.post('/login', login)
Router.get('/getMe', protect, getMe)
Router.put('/resetpassword', resetUserPassword)
Router.put('/resetpassword/:resettoken', resetPassFromToken)
Router.put('/editdetails', protect, editDetails)
Router.put('/editpassword', protect, editPassword)
Router.post('/logout', protect, logOut)

module.exports = Router