const theMongoose = require('mongoose'),
  bcrypt = require('bcryptjs'),
  jwt = require('jsonwebtoken'),
  Users = new theMongoose.Schema({
    name: {
      type: String,
      required: [true, 'Please, add a name first.']
    },
    password: {
      type: String,
      required: [true, 'Please, set a password.'],
      select: false,
      minlength: [6, 'Password should be at least six characters.']
    },
    email: {
      type: String,
      required: [true, 'Please, enter an e-mail first.'],
      match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i, 'Please, enter a vaild e-mail.'],
      unique: true
    },
    role: {
      type: String,
      enum: ['user', 'publisher'],
      default: 'user'
    },
    resetPasswordToken: String,
    resetPassowrdExpire: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
  })

Users.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  // console.log(salt)
  this.password = await bcrypt.hash(this.password, salt);
})

Users.methods.getSignedJwtToken = function () {
  return jwt.sign({
    id: this._id
  }, process.env.SecretOfPrivKey, {
    expiresIn: process.env.ExpiredTime
  })
}

Users.methods.verifyPassword = async function (insertedPass) {
  return await bcrypt.compare(insertedPass, this.password)
}

module.exports = theMongoose.model('theUsers', Users)