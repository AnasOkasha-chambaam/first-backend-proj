const theMongoose = require('mongoose');

exports.connetToDB = async () => {
  const conn = await theMongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })

  console.log(`Connected to mongoDB successfully: ${conn.connection.host}`.cyan.underline)
}