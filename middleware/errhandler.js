const TheErrHandler = (err, req, res, next) => {
  // console.log(`${err.stack}`.red.underline);
  console.log(err);
  let stCode = err.statusCode || 500,
    errMsg = err.message || "There is some errors with the server.";
  if (err.name === "CastError") {
    errMsg = `There is no Bootcamp with such id ${err.value}`;
    stCode = 404;
  }
  if (err.code === 11000) {
    errMsg = `The Name is already used. Please, change it and retry.`;
    stCode = 400;
  }
  if (err.name === "ValidationError") {
    /*
    errMsg = `The value in the ${
      Object.keys(err.errors)[0]
    } field is not vaild. Change it and retry.`;
    */
    errMsg = Object.values(err.errors).map(val => val.message)
    stCode = 400;
  }
  res.status(stCode).json({
    success: false,
    msg: errMsg,
    err: err.name,
    path: err.path || "No-path",
    realMsg: err.message,
  });
  // castError: wrong-format , validationError: wrong-information
};

module.exports = TheErrHandler;