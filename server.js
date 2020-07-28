const theExpress = require("express"),
  theDotenv = require("dotenv"),
  {
    connetToDB
  } = require('./db');

theDotenv.config({
  path: "./config/config.env",
});

connetToDB();

const app = theExpress(),
  thePort = process.env.PORT || 5001,
  theBootcampFunctions = require("./router/router"),
  // { theLogger } = require("./middleware/logger"),
  morgan = require("morgan");
// app.use(theLogger)

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use("/api/version1/bootcamps", theBootcampFunctions);

const theServer = app.listen(thePort, () => {
  console.log(
    `The server is running in the ${process.env.NODE_ENV} mode and on ${thePort} port.`
  );
});

process.on('unhandledRejection', (err, promise) => {
  // console.log(err)
  console.log(`Error: ${err.message}`)
  theServer.close(() => process.exit(1))
})