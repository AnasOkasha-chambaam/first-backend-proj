const theExpress = require("express"),
  theDotenv = require("dotenv");

theDotenv.config({
  path: "./config/config.env",
});

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

app.listen(thePort, () => {
  console.log(
    `The server is running in the ${process.env.NODE_ENV} mode and on ${thePort} port.`
  );
});
