const AUser = require("../model/Users");
const ErrResp = require("../utils/errResp");

exports.getAllUsers = async (req, res, next) => {
  try {
    let query,
      strQuery,
      toRemove,
      toFind,
      pagination = {};
    toRemove = ["select", "limit", "page", "sort"];
    console.log(req.query);
    strQuery = JSON.stringify(req.query);
    strQuery = strQuery.replace(
      /\b(lte|lt|gte|gt|in)\b/g,
      (match) => `$${match}`
    );
    query = JSON.parse(strQuery);
    toRemove.forEach((one) => delete query[one]);
    toFind = AUser.find(query);

    if (req.query.select) {
      toFind = toFind.select(req.query.select.split(",").join(" "));
    }
    if (req.query.limit) {
      let limit, page, skip;
      limit = parseInt(req.query.limit) || 2;
      page = parseInt(req.query.page) || 1;
      skip = (page - 1) * limit;
      toFind = toFind.limit(limit).skip(skip);
      if (skip > 0) {
        pagination.prev = {
          page: page - 1,
          limit: limit,
        };
      }
      console.log(skip);
      console.log(limit);
      console.log(AUser.countDocuments());
      console.log(skip + limit < (await AUser.countDocuments()));
      if (skip + limit < (await AUser.countDocuments())) {
        pagination.next = {
          page: page + 1,
          limit,
        };
      }
    }
    if (req.query.sort) {
      toFind = toFind.sort(req.query.sort);
    } else {
      toFind = toFind.sort("-createdAt");
    }
    console.log(strQuery);
    console.log(query);

    const users = await toFind;
    res.status(200).send({
      success: true,
      pagination,
      NoOfUsers: users.length,
      users,
    });
  } catch (er) {
    next(er);
  }
};

exports.getAUser = async (req, res, next) => {
  try {
    const user = await AUser.findById(req.params.id);
    if (!user) {
      return next(
        new ErrResp(`There is no user with such an id ${req.params.id}`, 404)
      );
    }
    res.status(200).send({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};

exports.addAUser = async (req, res, next) => {
  try {
    const newUser = await AUser.create(req.body);
    setLoginToken(newUser, 201, res);
  } catch (er) {
    console.log(req.body);
    next(er);
  }
};

exports.deleteAUser = async (req, res, next) => {
  try {
    const userToRemove = await AUser.findById(req.params.id);
    if (!userToRemove) {
      return next(new ErrResp("User not found to delete!.", 404));
    }
    if (userToRemove.role === "admin") {
      return next(new ErrResp("You cannot delete admins!.", 403));
    }
    userToRemove.remove();
    res.status(201).send({
      success: true,
      msg: "User has been destroyed!.",
    });
  } catch (er) {
    next(er);
  }
};

exports.updateAUserDetails = async (req, res, next) => {
  try {
    const {
      name,
      email,
      role
    } = req.body;
    const userToUpdate = await AUser.findByIdAndUpdate(
      req.params.id, {
        name,
        email,
      }, {
        new: true,
        runValidators: true,
      }
    );
    if (!userToUpdate) {
      return next(new ErrResp("There is no user with such id to update", 404));
    }

    if (role === "admin") {
      userToUpdate.role = role;
      await userToUpdate.save({
        validateBeforeSave: false,
      });
    } else {
      userToUpdate.role = role;
      await userToUpdate.save({
        validateBeforeSave: true,
      });
    }
    res.status(201).send({
      success: true,
      msg: "The user was updated successfully.",
      userToUpdate,
    });
  } catch (er) {
    next(er);
  }
};

exports.changeUserPassword = async (req, res, next) => {
  try {
    const {
      password
    } = req.body;
    if (!password) {
      return next(new ErrResp('There is an error. Are you sure you are admin?', 401))
    }

    const user = await AUser.findById(req.params.id).select("+password");
    if (!user) {
      return next(new ErrResp('User not found!', 404))
    }
    if (user.role === 'admin') {
      return next(new ErrResp('You cannot change the password of this user!', 401))
    }
    user.password = password;
    await user.save({
      validateBeforeSave: true
    })

    res.status(201).send({
      success: true,
      msg: 'Password has been edited!'
    })
  } catch (er) {
    next(er)
  }
};

const setLoginToken = (user, stCode, resp) => {
  const token = user.getSignedJwtToken();
  if (!token) {
    return next(new ErrResp("There issss an error!", 500));
  }
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_Cookie_Expire * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }
  resp
    .status(stCode)
    .cookie("TheToken", token, options)
    .send({
      success: true,
      msg: `Welcome ${user.name}, You are Signed innn.`,
      user,
      token,
    });
};