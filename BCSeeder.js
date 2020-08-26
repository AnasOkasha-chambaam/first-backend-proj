const TheDotenv = require('dotenv'),
  TheMongoose = require('mongoose'),
  TheFs = require('fs'),
  BCModel = require('./model/Bootcamps'),
  TheColors = require('colors');

TheDotenv.config({
  path: './config/config.env'
})
const ConnectToDB = async () => {
  await TheMongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });
  console.log(`The Bootcamps seeder has been connected`.cyan.underline)

}
ConnectToDB()

const TheAddedData = JSON.parse(TheFs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));

const seedBC = async () => {
  try {
    await BCModel.create(
      TheAddedData
    );
    console.log(`Bootcamps have been added.`.green.inverse)
    process.exit()
  } catch (error) {
    console.log(error)
    console.log(`There is an error.`)
  }
}

const destroyBCs = async () => {
  try {
    await BCModel.deleteMany();
    console.log(`The Bootcamps are destroyed.`.red.inverse);
    process.exit()
  } catch (error) {
    console.log(error)
  }
}
// console.log(TheFs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))
if (process.argv[2] === '-i') {
  seedBC()
} else if (process.argv[2] === '-d') {
  destroyBCs()
}