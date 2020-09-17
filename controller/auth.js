const AUser = require('../model/Users'),
  jwt = require('jsonwebtoken'),
  ErrResp = require('../utils/errResp');

exports.register = async (requ, resp, next) => {
  try {
    const {
      name,
      role,
      password,
      email
    } = requ.body,
      newUser = await AUser.create({
        name,
        role,
        password,
        email
      })

    setLoginCookie(resp, 200, newUser)
    /*
    const token = await newUser.getSignedJwtToken()
    resp.status(200).send({
      success: true,
      token,
      data: newUser
    })
    */
  } catch (er) {
    next(er)
  }
}

exports.login = async (req, res, next) => {
  try {
    const {
      email,
      password
    } = req.body;
    if (!email || !password) {
      return next(new ErrResp('Please, enter an email and a password first.', 400))
    }
    const user = await AUser.findOne({
      email
    }).select('+password');
    if (!user) {
      return next(new ErrResp('There is no user with such an email.', 401))
    }
    const verifedPass = await user.verifyPassword(req.body.password)
    if (!verifedPass) {
      return next(new ErrResp('Wrong password!.', 401))
    }

    setLoginCookie(res, 200, user)
    /*
    const token = user.getSignedJwtToken()

    res.status(200).send({
      success: true,
      msg: `Welcome "${user.name}", you are logged in successfully.`,
      token
    })
    console.log('======================')
    console.log(req.body)
    console.log('======================')
    console.log(req.headers)
    */
  } catch (er) {
    next(er)
  }
}

const setLoginCookie = (res, statusCode, user) => {
  const token = user.getSignedJwtToken(),
    cookieOptions = {
      expires: new Date(Date.now() + process.env.JWT_Cookie_Expire * 24 * 60 * 60 * 1000),
      httpOnly: true
    };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true
  }

  res.status(statusCode).cookie('TheToken', token, cookieOptions).send({
    success: true,
    msg: `Welcome "${user.name}", you are logged in.`,
    user,
    token
  })
}