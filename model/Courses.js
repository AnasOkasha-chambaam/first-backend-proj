const { model } = require("./Bootcamps"),
  colors = require("colors"),
  Bootcamp = require("./Bootcamps");

const theMongoose = require("mongoose"),
  courses = new theMongoose.Schema({
    title: {
      type: String,
      required: [true, "A course must have a vaild title."],
      unique: true,
      maxlength: [
        50,
        "The title characters should not exceed the number of 50.",
      ],
      trim: true,
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Please, write a discription to the course."],
      maxlength: [
        500,
        "The description characters should not exceed the number of 500.",
      ],
    },
    weeks: Number,
    tuition: Number,
    minimumSkill: {
      type: String,
      enum: ["beginner", "intermediate", "professional"],
    },
    scholarhipsAvailable: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    bootcamp: {
      type: theMongoose.Schema.ObjectId,
      required: true,
    },
  });

courses.statics.getAv = async function (theId) {
  console.log("Calculateing the average cost...".blue);
  const objj = await this.aggregate([
    {
      $match: {
        bootcamp: theId,
      },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: {
          $avg: "$tuition",
        },
      },
    },
  ]);

  console.log(objj);
  try {
    await Bootcamp.findByIdAndUpdate(
      objj[0]._id,
      {
        averageCost: Math.ceil(objj[0].averageCost / 10) * 10,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  } catch (error) {
    console.error(error);
  }
};

courses.post("save", function () {
  this.constructor.getAv(this.bootcamp);
});

courses.pre("remove", function () {
  this.constructor.getAv(this.bootcamp);
});
module.exports = theMongoose.model("CoursesDB", courses);
// "bootcamp": "5d713995b721c3bb38c1f5d0",
// 5d713995b721c3bb38c1f5d0
// 5d713a66ec8f2b88b8f830b8
// 5d713a66ec8f2b88b8f830b8
// 5d725a037b292f5f8ceff787
// 5d725a037b292f5f8ceff787
// 5d725a1b7b292f5f8ceff788
// 5d725a1b7b292f5f8ceff788
// 5d725a1b7b292f5f8ceff788
