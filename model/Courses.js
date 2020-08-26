const {
  model
} = require('./Bootcamps')

const theMongoose = require('mongoose'),
  courses = new theMongoose.Schema({
    title: {
      type: String,
      required: [true, 'A course must have a vaild title.'],
      unique: true,
      maxlength: [50, 'The title characters should not exceed the number of 50.'],
      trim: true
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Please, write a discription to the course.'],
      maxlength: [500, 'The description characters should not exceed the number of 500.']
    },
    weeks: Number,
    tuition: Number,
    minimumSkill: {
      type: String,
      enum: ['beginner', 'intermediate', 'professional']
    },
    scholarhipsAvailable: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    bootcamp: {
      type: theMongoose.Schema.ObjectId,
      required: true
    }
  })

module.exports = theMongoose.model('CoursesDB', courses)
// "bootcamp": "5d713995b721c3bb38c1f5d0",
// 5d713995b721c3bb38c1f5d0
// 5d713a66ec8f2b88b8f830b8
// 5d713a66ec8f2b88b8f830b8
// 5d725a037b292f5f8ceff787
// 5d725a037b292f5f8ceff787
// 5d725a1b7b292f5f8ceff788
// 5d725a1b7b292f5f8ceff788
// 5d725a1b7b292f5f8ceff788