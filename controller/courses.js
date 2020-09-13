const Courses = require("../model/Courses"),
  Bootcamps = require('../model/Bootcamps'),
  ErrResp = require("../utils/errResp"),
  {
    Error
  } = require("mongoose");

exports.getABootcampCourses = async (req, res, next) => {
  console.log(req.params.bootcampIDD);
  try {
    if (req.params.bootcampIDD) {
      const relatedCourses = await Courses.find({
          bootcamp: req.params.bootcampIDD,
        })
        .populate({
          path: 'bootcamp',
          model: Bootcamps,
          select: 'name description'
        })
      // .populate('bootcamp', 'name description', 'BootSch');

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

    let theOrder,
      AQuery = {
        ...req.query
      },
      AStringQuery,
      toRemove = ['select', 'sort', 'page', 'limit'];

    toRemove.forEach(one => delete AQuery[one])
    AStringQuery = JSON.stringify(AQuery);
    AStringQuery = AStringQuery.replace(/\b(lte|lt|gte|gt|in)\b/g, match => `$${match}`);
    AQuery = JSON.parse(AStringQuery)

    theOrder = Courses.find(AQuery)
    if (req.query.select) {
      theOrder = theOrder.select(req.query.select.split(',').join(' '))
    }
    // console.log(req.query)

    if (req.query.sort) {
      let sortBy = req.query.sort.split(',').join(' ');
      theOrder = theOrder.sort(sortBy);
    } else {
      theOrder = theOrder.sort("-createdAt")
    }

    let pagination = {},
      currentPage = 0;

    if (req.query.limit) {
      let pageNo = parseInt(req.query.page) || 1,
        theLimit = parseInt(req.query.limit) || 3,
        toSkip = (pageNo - 1) * theLimit,
        lastShown = pageNo * theLimit,
        DocsNum = await Courses.countDocuments();
      console.log(theLimit)
      theOrder = theOrder.limit(theLimit).skip(toSkip);

      console.log(req.query)

      if (toSkip > 0) {
        pagination.previous = {
          prevPage: (pageNo - 1),
          value: true
        }
      }
      console.log(lastShown)
      console.log(DocsNum)
      if (lastShown < DocsNum) {
        pagination.next = {
          value: true,
          nextPage: (pageNo + 1)
        }
      }
      currentPage = pageNo
    }


    // console.log(AStringQuery)
    // console.log(AQuery)


    const AllCourses = await theOrder
      .populate({
        path: 'bootcamp',
        model: Bootcamps,
        select: 'name description'
      })
    // console.log(req.query)
    // .populate('bootcamp', 'name description', 'BootSch');

    res.status(200).send({
      success: "Yes",
      coursesLength: AllCourses.length,
      pagination: pagination,
      currentPage,
      data: AllCourses,
    });
  } catch (error) {
    next(error);
  }
};

exports.getACourse = async (req, res, next) => {
  try {
    const ACourse = await Courses.findById(req.params.id)
      .populate({
        path: 'bootcamp',
        model: Bootcamps,
        select: 'name description'
      })
    // .populate('bootcamp', 'name description', 'BootSch');

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

exports.postABootcampCourse = async (req, res, next) => {
  try {
    req.body.bootcamp = req.params.bootcampIDD;

    const theBootcamp = await Bootcamps.findById(req.body.bootcamp);
    if (!theBootcamp) {
      return res.status(404).send({
        success: false,
        msg: `There is no bootcamp with the id ${req.params.id}`
      })
    }

    const addedCourse = await Courses.create(req.body);
    res.status(201).send({
      success: true,
      msg: `A course has been added successfully.`,
      AddedCoures: addedCourse
    })
  } catch (err) {
    next(err)
  }
}

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
    const deletedCourse = await Courses.findById(req.params.id);

    if (!deletedCourse) {
      return res.status(404).send({
        sucess: false,
        msg: `There is no such a course with the id of ${req.params.id}`,
      });
    }

    await deletedCourse.remove()

    res.status(201).send({
      success: "Yes",
      msg: `A course of the id ${req.params.id} has been distroyed.`,
    });
  } catch (error) {
    next(error);
  }
};