const Reviews = require("../model/Reviews"),
  Bootcamps = require('../model/Bootcamps'),
  ErrResp = require("../utils/errResp"),
  {
    Error
  } = require("mongoose");

exports.getABootcampReviews = async (req, res, next) => {
  console.log(req.params.id);
  try {
    if (req.params.id) {
      const relatedReviews = await Reviews.find({
          bootcamp: req.params.id,
        })
        .populate({
          path: 'bootcamp',
          model: Bootcamps,
          select: 'name description'
        })
      // .populate('bootcamp', 'name description', 'BootSch');

      if (!relatedReviews) {
        return res.status(404).send({
          success: false,
          msg: `There is no such a review with the id of ${req.params.id}`,
        });
      }

      res.status(200).send({
        success: "Yes",
        count: relatedReviews.length,
        data: relatedReviews,
      });
    } else {
      res.status(404).send({
        success: false,
        msg: `There is no such a review!.`,
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.getAllReviews = async (req, res, next) => {
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

    theOrder = Reviews.find(AQuery)
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
        DocsNum = await Reviews.countDocuments();
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


    const AllReviews = await theOrder
      .populate({
        path: 'bootcamp',
        model: Bootcamps,
        select: 'name description'
      })
    // console.log(req.query)
    // .populate('bootcamp', 'name description', 'BootSch');

    res.status(200).send({
      success: "Yes",
      reviewsLength: AllReviews.length,
      pagination: pagination,
      currentPage,
      data: AllReviews,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAReview = async (req, res, next) => {
  try {
    const AReview = await Reviews.findById(req.params.id)
      .populate({
        path: 'bootcamp',
        model: Bootcamps,
        select: 'name description'
      })
    // .populate('bootcamp', 'name description', 'BootSch');

    if (!AReview) {
      return next(new ErrResp("The review is not found!", 404));
    }

    res.status(200).send({
      success: "yes",
      data: AReview,
    });
  } catch (err) {
    next(err);
  }
};

exports.postAReview = async (req, res, next) => {
  try {
    console.log(req.body);
    req.body.user = req.user.id;
    const AddedReview = await Reviews.create(req.body);

    res.status(201).send({
      success: "Yes",
      theNewReview: AddedReview,
    });
  } catch (error) {
    next(error);
  }
};

exports.postABootcampReview = async (req, res, next) => {
  try {
    req.body.bootcamp = req.params.id;
    req.body.user = req.user.id;
    const theBootcamp = await Bootcamps.findById(req.body.bootcamp);
    if (!theBootcamp) {
      return res.status(404).send({
        success: false,
        msg: `There is no bootcamp with the id ${req.params.id}`
      })
    }

    const addedReview = await Reviews.create(req.body);
    res.status(201).send({
      success: true,
      msg: `A review has been added successfully.`,
      AddedReview: addedReview
    })
  } catch (err) {
    next(err)
  }
}

exports.updateAReview = async (req, res, next) => {
  try {
    const UpdatedRev = await Reviews.findByIdAndUpdate(
      req.params.id,
      req.body, {
        new: true,
        runValidators: true,
      }
    );

    if (!UpdatedRev) {
      return res.status(404).send({
        sucess: false,
        msg: `There is no such a review with the id of ${req.params.id}`,
      });
    }

    res.status(201).send({
      success: "Yes",
      theUpdatedOne: UpdatedRev,
    });

    next(new ErrResp("There is no review with such an id.", 404));
  } catch (error) {
    next(error);
  }
};

exports.deleteAReview = async (req, res, next) => {
  try {
    const deletedReview = await Reviews.findById(req.params.id);

    if (!deletedReview) {
      return res.status(404).send({
        sucess: false,
        msg: `There is no such a review with the id of ${req.params.id}`,
      });
    }

    await deletedReview.remove()

    res.status(201).send({
      success: "Yes",
      msg: `A review of the id ${req.params.id} has been distroyed.`,
    });
  } catch (error) {
    next(error);
  }
};