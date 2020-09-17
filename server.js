const path = require('path'),
  theExpress = require("express"),
  theDotenv = require("dotenv"),
  {
    connetToDB
  } = require('./db'),
  colorse = require('colors'),
  errorHan = require('./middleware/errhandler'),
  fileUp = require('express-fileupload'),
  cookieParser = require('cookie-parser');

theDotenv.config({
  path: "./config/config.env",
});

connetToDB();

const app = theExpress(),
  thePort = process.env.PORT || 5001,
  theBootcampFunctions = require("./router/router"),
  theAuthFunctions = require('./router/auth'),
  // { theLogger } = require("./middleware/logger"),
  morgan = require("morgan");
// app.use(theLogger)
app.use(theExpress.json())

app.use(cookieParser())

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(fileUp())
app.use(theExpress.static(path.join(__dirname, 'public')))
app.use("/api/version1", theBootcampFunctions);
app.use('/api/version1/auth', theAuthFunctions)
app.use(errorHan)

const theServer = app.listen(thePort, () => {
  /*
  let AnObject = {
      name: 'unknown',
      age: 121,
      gender: 'unknown'
    },
    aCopy = {
      ...AnObject
    },
    anotherCopy = AnObject;
  console.log(AnObject)
  console.log(aCopy)
  console.log(anotherCopy)
  */

  console.log(
    `The server is running in the ${process.env.NODE_ENV} mode and on ${thePort} port.`.yellow.bold
  );
});

process.on('unhandledRejection', (err, promise) => {
  // console.log(err)
  console.log(`Error: ${err.message}`.red.bold)
  theServer.close(() => process.exit(1))
})