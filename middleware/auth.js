const jwt = require('jsonwebtoken'),
  ErrResp = require('../utils/errResp'),
  User = require('../model/Users')


exports.protect = async (req, res, next) => {
  // console.log('======================')
  // console.log(req.headers.authorization)
  // console.log(req.headers.authorization.startsWith('Bearer'))
  // console.log('======================')

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // console.log('fuckin\' hey')
    // let notFound;
    try {
      const encoded = await jwt.verify(req.headers.authorization.split(' ')[1], process.env.SecretOfPrivKey)
      // console.log(encoded);
      if (!encoded) {
        return next(new ErrResp('Please, sign in first.', 401))
      }

      const TheUser = await User.findOne({
        _id: encoded.id
      })
    } catch (err) {
      next(new ErrResp('Please, sign in to reach this route.', 401))
    }
  } else {
    return next(new ErrResp('Please, sign the fuck in first.'))
  }
  next()
}