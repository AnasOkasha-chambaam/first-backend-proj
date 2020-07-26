const theExpress = require("express"),
  theDotenv = require("dotenv");

theDotenv.config({ path: "./config/config.env" });

const app = theExpress(),
  thePort = process.env.PORT || 5001;

app.listen(thePort, () => {
  console.log(
    `The server is running in the ${process.env.NODE_ENV} mode and on ${thePort} port.`
  );
});
