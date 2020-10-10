const jwt = require("jsonwebtoken"),
  ErrResp = require("../utils/errResp"),
  User = require("../model/Users"),
  Bootcamp = require("../model/Bootcamps");

/*
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
*/

exports.protect = async (req, res, next) => {
  let token;
  if (req.cookies) {
    token = req.cookies.TheToken;
  }
  // else if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith("Bearer")
  // ) {
  //   token = await req.headers.authorization.split(" ")[1];
  // }
  if (!token) {
    return next(new ErrResp("Please, sign in first!.", 401));
  }
  try {
    const encoded = await jwt.verify(token, process.env.SecretOfPrivKey);
    req.user = await User.findOne({
      _id: encoded.id,
    });
    if (!req.user) {
      return next(
        new ErrResp(`There is no user with this id "${encoded.id}"`, 404)
      );
    }
    // console.log(req.user)
    // console.log('====-------=====')
    // console.log(req.cookies)
    next();
  } catch (er) {
    console.log('------------------======================0---------------')
    console.log(er)
    console.log('--------------000000000000000000000-----------------')
    next(new ErrResp("You are not authorized to reach this!", 401));
  }
};

exports.authorize = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrResp(
          `This user of role ${req.user.role} is not authorized to reach this route.`,
          403
        )
      );
    }
    next();
  };
};

exports.makeSure = (msg) => {
  return async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrResp("The id is not vaild. Please, enter a right one.", 404)
      );
    }

    if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        new ErrResp(`The user ${req.user.name} is not authorized to ${msg}`)
      );
    }
    next();
  };
};

exports.onlyAdmin = async (req, res, next) => {
  try {
    let token;
    if (req.cookies) {
      token = req.cookies.TheToken
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
      return next(new ErrResp('Please, login first!', 401))
    }
    const encoded = await jwt.verify(token, process.env.SecretOfPrivKey);
    req.user = await User.findById(encoded.id);
    if (!req.user) {
      return next(new ErrResp('There is no user with such id. Sign in again, please.', 404))
    }
    if (req.user.role !== 'admin') {
      return next(new ErrResp("You're not allowed to reach this route, only admins are.", 500))
    }
    req.encodedd = encoded
    next()
  } catch (err) {
    next(err)
  }
}