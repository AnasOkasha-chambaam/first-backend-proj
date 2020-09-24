const User = require("./model/users"),
  color = require("colors"),
  fs = require("fs"),
  mongoose = require("mongoose"),
  dotenv = require('dotenv');


dotenv.config({
  path: './config/config.env'
})
const connectToDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })

  console.log('The users seeder is connected to the database successfully.'.cyan.underline.inverse)
}





connectToDB();
console.log("This is the users seeders.".cyan);

const addAllUsers = async () => {
  const UsersData = await fs.readFileSync(`${__dirname}/_data/users.json`);
  /*
  console.log('---------==================----------'.green)
  console.log(UsersData);
  console.log('---------==================----------'.yellow)
  console.log(parsedData)
  */
  const parsedData = JSON.parse(UsersData);
  // console.log(process.argv[2])
  try {
    console.log("===-=-=-=-=-=-=-=-");
    console.log(parsedData);
    console.log("===-=-=-=-=-=-=-=-");
    await User.create(parsedData);
    console.log("Users have been seeded.".green);
    process.exit()
  } catch (err) {
    console.log(err);
    console.log('Something went wrong'.red.inverse)
    process.exit()
  }
};

const distroyUsers = async () => {
  try {
    await User.deleteMany();
    console.log("Users have been distroyed.".red.underline);
    process.exit()
  } catch (errr) {
    console.log(errr)
    console.log('SomeThing went wrong!'.red.inverse)
    process.exit()
  }
};

if (process.argv[2] === "-i") {
  addAllUsers();
}

if (process.argv[2] === "-d") {
  distroyUsers();
}