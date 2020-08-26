const theMongoose = require('mongoose'),
  theSlugify = require('slugify'),
  BootcampSchema = new theMongoose.Schema({
    name: {
      type: String,
      required: [true, 'You must give the bootcamp a name.'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name can only have a maximum of 50 characters.']
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'The bootcamp should have a description'],
      maxlength: [500, 'The description characters number shouldn\'t exceed 500.']
    },
    website: {
      type: String,
      match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i, 'Please, enter a URL vaild with HTTP or HTTPS.']
    },
    phone: String,
    email: {
      type: String,
      match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i, 'Please, enter a vaild e-mail.']
    },
    address: {
      type: String,
      required: [true, 'The address is required.']
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: false
      },
      coordinates: {
        type: [Number],
        required: false,
        index: '2dsphere'
      },
      formattedAddress: String,
      street: String,
      city: String,
      status: String,
      zipcode: String,
      country: String
    },
    careers: {
      type: [String],
      required: true,
      enum: [
        'Web Development',
        'UI/UX',
        'Mobile Development',
        'Data Science',
        'Business',
        'Special',
        'other'
      ]
    },
    averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1.'],
      max: [10, 'The maximum rating value is 10.']
    },
    averageCost: Number,
    photo: {
      type: String,
      default: 'no-photo.jpg'
    },
    housing: {
      type: Boolean,
      default: false
    },
    jopAssistance: {
      type: Boolean,
      default: false
    },
    jopGuarantee: {
      type: Boolean,
      default: false
    },
    acceptGi: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }, {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  })

BootcampSchema.pre('save', function (next) {
  this.slug = theSlugify(this.name, {
    lower: true
  })
  console.log(this.slug)
  next()
})

BootcampSchema.pre('remove', async function (next) {
  await this.model('CoursesDB').deleteMany({
    bootcamp: this._id
  })
  console.log(`Courses of the bootcamp of the id ${this._id} has been distroyed!`.red.underline)
  next()
})

BootcampSchema.virtual('ccourses', {
  ref: 'CoursesDB',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false
})

module.exports = theMongoose.model('BootSch', BootcampSchema)