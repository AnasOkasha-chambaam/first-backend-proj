const theMongoose = require('mongoose'),
  fs = require('fs'),
  theDotenv = require('dotenv'),
  Reviews = require('./model/Reviews'),
  // Courses = require('./model/Courses'),
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
  console.log('The Reviews seeder has been connected to the mongoose database.'.cyan.underline)
}
connectDB();

const addAllreviews = async () => {
  try {
    const allofthem = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8'));
    await Reviews.create(allofthem);

    console.log(`All Reviews has been added!`.green.inverse)
    process.exit()
  } catch (err) {
    console.log(err);

    console.log(`Something went wrong`.red.underline)
  }
}

const destroyAllreviews = async () => {
  try {
    await Reviews.deleteMany();
    console.log(`All reviews have been distroyed!.`.red.inverse)
    process.exit()
  } catch (err) {
    console.log(err);
    console.log(`Something went wrong`.red.underline)
  }
}

if (process.argv[2] === '-i') {
  addAllreviews()
}
if (process.argv[2] === '-d') {
  destroyAllreviews()
}