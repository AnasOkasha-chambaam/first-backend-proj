const theMongoose = require('mongoose'),
  fs = require('fs'),
  theDotenv = require('dotenv'),
  theCoursesDB = require('./model/Courses'),
  Courses = require('./model/Courses'),
  colors = require('colors')


theDotenv.config({
  path: './config/config.env'
})
const connectDB = async () => {
  0
  await theMongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  console.log('The courses seeder has been connected to the mongoose database.'.cyan.underline)
}
connectDB();

const addAllcourses = async () => {
  try {
    const allofthem = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));
    await Courses.create(allofthem);

    console.log(`All courses has been added!`.green.inverse)
    process.exit()
  } catch (err) {
    console.log(err);

    console.log(`Something went wrong`.red.underline)
  }
}

const destroyAllcourses = async () => {
  try {
    await Courses.deleteMany();
    console.log(`All courses have been distroyed!.`.red.inverse)
    process.exit()
  } catch (err) {
    console.log(err);
    console.log(`Something went wrong`.red.underline)
  }
}

if (process.argv[2] === '-i') {
  addAllcourses()
} else if (process.argv[2] === '-d') {
  destroyAllcourses()
}