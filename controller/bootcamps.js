const TheErrResp = require('../utils/errResp');

const TheBootSch = require("../model/Bootcamps");
const {
  findByIdAndDelete
} = require("../model/Bootcamps");


exports.getAllBootcamps = async (requ, resp, next) => {
  try {
    // console.log(requ.query)
    let query, queryStr, reqQuery, toRemove;
    reqQuery = {
      ...requ.query
    };
    toRemove = ['select', 'sort', 'limit', 'page'];
    toRemove.forEach(one => delete reqQuery[one]);
    // console.log(reqQuery);
    queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
    query = TheBootSch.find(JSON.parse(queryStr)).populate('ccourses');
    console.log(query)

    if (requ.query.select) {
      const fields = requ.query.select.split(',').join(' ');
      console.log(`${fields}`.red)
      query = query.select(fields);
    }
    if (requ.query.sort) {
      const sortBy = requ.query.sort.split(',').join(' ');
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }
    let pagination = {},
      alio, alioo;
    if (requ.query.limit) {
      const pageNo = parseInt(requ.query.page, 10) || 1,
        theLimit = parseInt(requ.query.limit) || 10,
        startAfter = (pageNo - 1) * theLimit,
        lastShown = pageNo * theLimit,
        DocsNumber = await TheBootSch.countDocuments();
      alio = DocsNumber;
      alioo = lastShown;
      console.log(theLimit)

      query = query.skip(startAfter).limit(theLimit);
      if (lastShown < DocsNumber) {
        pagination.next = {
          page: (pageNo + 1),
          theLimit
        }
      }
      if (startAfter > 0) {
        pagination.previous = {
          page: (pageNo - 1),
          theLimit
        }
      }

    }


    const AllBootcamps = await query;
    resp.setHeader("Content-Type", "application/json");
    resp.status(200).json({
      success: true,
      NumberOfBootcamps: AllBootcamps.length,
      pagination,
      DocsNumber: alio,
      lastShown: alioo,
      data: AllBootcamps,
    });
  } catch (err) {
    next(err);
    /*
    resp.status(400).json({
      success: false,
      msg: err.message,
    });
    */
  }

  // console.log(requ);
  /*
  resp.status(200).json({
    success: true,
    msg: `Show the all bootcamps...`,
    anyT: requ.anyThing,
  });
  */
};

exports.getOneBootcamp = async (requ, resp, next) => {
  try {
    const OneBootcamp = await TheBootSch.findById(requ.params.id).populate('ccourses');
    if (!OneBootcamp) {

      return next(new TheErrResp('The id is not vaild. Please, enter a right one.', 404))
    }
    resp.status(200).json({
      success: true,
      relatedCoursesLength: OneBootcamp.ccourses.length,
      data: OneBootcamp,
    });
  } catch (err) {
    next(err)
    /*
    resp.status(404).json({
      success: false,
      msg: err.message,
    });
    */
  }

  // console.log(requ);
  /*
  resp.status(200).json({
    success: true,
    msg: `Show the bootcamp of the id ${requ.params.id} ...`,
    anyT: `${requ.anyThing} two...`,
  });
  */
};

exports.addOneBootcamp = async (requ, resp, next) => {
  try {
    // console.log(Array.from(requ.body));
    // console.log(typeof JSON.parse(requ.body));
    // console.log(JSON.parse(requ.body));
    // const addedData = await requ.body,
    // formatAdded = await Array.of((addedData))
    // console.log(`${typeof formatAdded}`.red);

    // const BootcampJSON = await TheBootSch.create();
    const BootcampJSON = await TheBootSch.create(requ.body);
    resp.status(201).json({
      success: true,
      msg: `A bootcamp has been added.`,
      AddedData: BootcampJSON,
    });
  } catch (err) {
    next(err);
    /*
    resp.status(400).json({
      success: false,
      err: "Unkown yet!",
    });
    */
  }
};

exports.updateOneBootcamp = async (requ, resp, next) => {
  try {
    const UpdatedBootcamp = await TheBootSch.findByIdAndUpdate(
      requ.params.id,
      requ.body, {
        new: true,
        runValidators: true
      }
    );
    if (!UpdatedBootcamp) {
      return next(new TheErrResp('The id is not vaild. Please, enter a right one.', 404))
    }
    resp.status(201).json({
      success: true,
      TheUpdatedOne: UpdatedBootcamp,
    });
  } catch (err) {
    next(err)
    /*
    resp.status(400).json({
      success: false,
      msg: err.message,
    });
    */
  }

  // console.log(requ);
  /*
  resp.status(200).json({
    succuess: true,
    msg: `Update the bootcamp of the id ${requ.params.id}`,
  });
  */
};

exports.deleteOneBootcamp = async (requ, resp, next) => {
  try {
    const DeletedBootcamp = await TheBootSch.findById(requ.params.id);
    if (!DeletedBootcamp) {
      return next(new TheErrResp('The id is not vaild. Please, enter a right one.', 404))
    }

    DeletedBootcamp.remove()

    resp.status(201).json({
      success: true,
      msg: `The bootcamp of the id ${requ.params.id} has been deleted!.`,
    });
  } catch (err) {
    next(err)
    /*
    resp.status(400).json({
      success: false,
      msg: `There is an error`,
      errMsg: err.message,
    });
    */
  }

  // console.log(requ);
  /*
  resp.status(200).json({
    success: true,
    msg: `Delete the bootcamp of the id ${requ.params.id}`,
  });
  */
};