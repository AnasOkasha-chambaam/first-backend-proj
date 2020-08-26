const Courses = require("../model/Courses");
const ErrResp = require("../utils/errResp");
const {
  Error
} = require("mongoose");

exports.getABootcampCourses = async (req, res, next) => {
  console.log(req.params.bootcampIDD);
  try {
    if (req.params.bootcampIDD) {
      const relatedCourses = await Courses.find({
        bootcamp: req.params.bootcampIDD,
      }).populate('bootcamp', 'name description', 'BootSch');

      if (!relatedCourses) {
        return res.status(404).send({
          success: false,
          msg: `There is no such a course with the id of ${req.params.bootcampIDD}`,
        });
      }

      res.status(200).send({
        success: "Yes",
        count: relatedCourses.length,
        data: relatedCourses,
      });
    } else {
      res.status(404).send({
        success: false,
        msg: `There is no such a course!.`,
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.getAllCourses = async (req, res, next) => {
  // console.log(req.)
  try {
    const AllCourses = await Courses.find().populate('bootcamp', 'name description', 'BootSch');

    res.status(200).send({
      success: "Yes",
      coursesLength: AllCourses.length,
      data: AllCourses,
    });
  } catch (error) {
    next(error);
  }
};

exports.getACourse = async (req, res, next) => {
  try {
    const ACourse = await Courses.findById(req.params.id);

    if (!ACourse) {
      return next(new ErrResp("The course is not found!", 404));
    }

    res.status(200).send({
      success: "yes",
      data: ACourse,
    });
  } catch (err) {
    next(err);
  }
};

exports.postACourse = async (req, res, next) => {
  try {
    console.log(req.body);
    const AddedCourse = await Courses.create(req.body);

    res.status(201).send({
      success: "Yes",
      theNewCourse: AddedCourse,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateACourse = async (req, res, next) => {
  try {
    const UpdatedCours = await Courses.findByIdAndUpdate(
      req.params.id,
      req.body, {
        new: true,
        runValidators: true,
      }
    );

    if (!UpdatedCours) {
      return res.status(404).send({
        sucess: false,
        msg: `There is no such a course with the id of ${req.params.id}`,
      });
    }

    res.status(201).send({
      success: "Yes",
      theUpdatedOne: UpdatedCours,
    });

    next(new ErrResp("There is no course with such an id.", 404));
  } catch (error) {
    next(error);
  }
};

exports.deleteACourse = async (req, res, next) => {
  try {
    const deletedCourse = await Courses.findByIdAndDelete(req.params.id);

    if (!deletedCourse) {
      return res.status(404).send({
        sucess: false,
        msg: `There is no such a course with the id of ${req.params.id}`,
      });
    }

    res.status(201).send({
      success: "Yes",
      msg: `A course of the id ${req.params.id} has been distroyed.`,
    });
  } catch (error) {
    next(error);
  }
};