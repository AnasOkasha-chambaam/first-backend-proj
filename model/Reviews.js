const colors = require("colors"),
  Bootcamp = require("./Bootcamps");
const theMon = require('mongoose'),
  reviewsSch = theMon.Schema({
    title: {
      type: String,
      required: [true, "A review must have a vaild title."],
      unique: true,
      maxlength: [
        50,
        "The title characters should not exceed the number of 50.",
      ],
      trim: true,
    },
    slug: String,
    text: {
      type: String,
      required: [true, "Please, write a review to the review."],
      maxlength: [
        900,
        "The description characters should not exceed the number of 500.",
      ],
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, 'Please, rate the course to submit the review!']
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    bootcamp: {
      type: theMon.Schema.ObjectId,
      ref: 'BootSch',
      required: true,
    },
    user: {
      type: theMon.Schema.ObjectId,
      ref: 'theUsers',
      required: true
    }
  })

reviewsSch.index({
  bootcamp: 1,
  user: 1
}, {
  unique: true
})

reviewsSch.statics.getAv = async function (theId) {
  console.log("Calculateing the average rating...".blue);
  const objj = await this.aggregate([{
      $match: {
        bootcamp: theId,
      },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: {
          $avg: "$rating",
        },
      },
    },
  ]);

  console.log(objj);
  try {
    await Bootcamp.findByIdAndUpdate(
      objj[0]._id, {
        averageRating: objj[0].averageRating,
      }, {
        new: true,
        runValidators: true,
      }
    );
  } catch (error) {
    console.error(error);
  }
};

reviewsSch.post("save", function () {
  this.constructor.getAv(this.bootcamp);
});

reviewsSch.pre("remove", function () {
  this.constructor.getAv(this.bootcamp);
});


module.exports = theMon.model('RevSch', reviewsSch)