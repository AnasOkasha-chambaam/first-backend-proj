const AUser = require('../model/Users'),
  jwt = require('jsonwebtoken'),
  ErrResp = require('../utils/errResp'),
  sendResetMail = require('../utils/nodemailer'),
  crypto = require('crypto')

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

exports.getMe = async (req, res, next) => {
  res.status(200).send({
    success: true,
    LoggedInUser: req.user
  })
}

exports.logOut = async (req, res, next) => {
  res.cookie('TheToken', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  })
  res.status(200).send({
    success: true,
    msg: 'Your logged out!',
    data: {}
  })
}

exports.resetUserPassword = async (req, res, next) => {
  const user = await AUser.findOne({
    email: req.body.email
  });
  if (!user) {
    return next(new ErrResp(`There is no user with the email ${req.body.email}`))
  }
  const TheToken = user.getResetPasswordToken();

  await user.save({
    validateBeforeSave: false
  })
  const toEmail = user.email,
    toSubject = 'Reset your password!',
    resultURL = `${req.protocol}://${req.get('host')}/api/version1/auth/resetpassword/${TheToken}`,
    message = `You asked for reseting your password!. To reset it go to the link below: \n \n
  ${resultURL}
  `
  try {
    await sendResetMail({
      toEmail,
      toSubject,
      message
    })

    return res.status(200).send({
      success: true,
      msg: 'The Reset mail was sent.'
    })
  } catch (err) {

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({
      validateBeforeSave: false
    });
    return next(err)
    // return next(new ErrResp('Something went wrong, Email was not sent. try again, please.', 404))

  }
  // console.log(TheToken)
  res.status(200).send({
    success: true,
    user
  })
};

exports.resetPassFromToken = async (req, res, next) => {
  try {
    console.log(req.params.resettoken)
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex'),
      user = await AUser.findOne({
        resetPasswordToken,
        resetPasswordExpire: {
          $gt: Date.now()
        }
      });
    if (!user) {
      console.log(resetPasswordToken)
      console.log('ba1b62d7414bfc0b022d20d367cc1792dea851200de4d6165df20dbf68b52c3e')
      console.log(user)
      return next(new ErrResp('This token is not invailed', 404))
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save()

    res.status(200).send({
      success: true,
      msg: 'Password was updated successfully!',
      user
    })
  } catch (er) {
    next(er)
  }
}

exports.editDetails = async (req, res, next) => {
  try {
    let {
      name,
      email
    } = req.body,
      toEdit = {
        name,
        email
      };
    if (!name) {
      toEdit.name = req.user.name
    }
    if (!email) {
      toEdit.email = req.user.email
    }
    console.log(`${name} // ${email}`)
    const user = await AUser.findByIdAndUpdate(req.user.id, toEdit, {
      runValidators: true,
      new: true
    });
    if (!user) {
      return next(new ErrResp('Please, login first.', 404))
    }
    res.status(200).send({
      success: true,
      msg: 'Data was updated successfully!',
      user
    })
  } catch (er) {
    next(er)
  }
}

exports.editPassword = async (req, res, next) => {
  try {
    const {
      currPass,
      newPass
    } = req.body,
      user = await AUser.findById(req.user.id).select('+password');
    if (!user) {
      return next(new ErrResp('Please, Sign in first!.', 404))
    }
    const verfiyPass = await user.verifyPassword(currPass);
    if (!verfiyPass) {
      return next(new ErrResp('Wrong password. Please, Try Again.', 500))
    }
    user.password = newPass;
    await user.save();
    setLoginCookie(res, 200, user)
  } catch (errr) {
    next(errr)
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