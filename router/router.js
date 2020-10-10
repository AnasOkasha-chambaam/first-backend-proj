const theSecExpress = require('express'),
  {
    getAllBootcamps,
    getOneBootcamp,
    addOneBootcamp,
    updateOneBootcamp,
    deleteOneBootcamp,
    uploadAPhoto
  } = require('../controller/bootcamps'),
  {
    getAllCourses,
    postACourse,
    updateACourse,
    getACourse,
    deleteACourse,
    getABootcampCourses,
    postABootcampCourse
  } = require('../controller/courses'),
  {
    getAllReviews,
    postAReview,
    updateAReview,
    getAReview,
    deleteAReview,
    getABootcampReviews,
    postABootcampReview
  } = require('../controller/reviews'),
  {
    onlyAdmin
  } = require('../middleware/auth'),
  {
    getAllUsers,
    getAUser,
    addAUser,
    deleteAUser,
    updateAUserDetails,
    changeUserPassword
  } = require('../controller/users'),
  theRouter = theSecExpress.Router({
    mergeParams: true
  }),
  {
    protect,
    authorize,
    makeSure
  } = require('../middleware/auth')

// bootcamps
theRouter.route('/bootcamps')
  .get(getAllBootcamps)
  .post(protect, addOneBootcamp)

theRouter.route('/bootcamps/:id')
  .get(getOneBootcamp)
  .put(protect, authorize('publisher', 'admin'), makeSure('update this bootcamp'), updateOneBootcamp)
  .delete(protect, authorize('publisher', 'admin'), makeSure('delete this bootcamp'), deleteOneBootcamp)

theRouter.route('/bootcamps/:id/photo')
  .put(protect, authorize('publisher', 'admin'), makeSure('update this bootcamp photo'), uploadAPhoto)

// courses
theRouter.route('/courses')
  .get(getAllCourses)
  .post(protect, authorize('publisher', 'admin'), postACourse)

theRouter.route('/courses/:id')
  .put(protect, authorize('publisher', 'admin'), updateACourse)
  .get(getACourse)
  .delete(protect, authorize('publisher', 'admin'), deleteACourse)

theRouter.route('/bootcamps/:id/courses')
  .get(getABootcampCourses)
  .post(protect, authorize('publisher', 'admin'), makeSure('add a course to this bootcamp'), postABootcampCourse)


// users
theRouter.route('/users')
  .get(onlyAdmin, getAllUsers)
  .post(onlyAdmin, addAUser)


theRouter.route('/users/:id')
  .get(onlyAdmin, getAUser)
  .delete(onlyAdmin, deleteAUser)
  .put(onlyAdmin, updateAUserDetails)

theRouter.route('/users/:id/resetpass')
  .put(onlyAdmin, changeUserPassword)


// reviews
theRouter.route('/reviews')
  .get(getAllReviews)
// .post(protect, authorize('publisher', 'admin'), postAReview)

theRouter.route('/reviews/:id')
  .put(protect, authorize('publisher', 'admin', 'user'), updateAReview)
  .get(getAReview)
  .delete(protect, authorize('publisher', 'admin', 'user'), deleteAReview)

theRouter.route('/bootcamps/:id/reviews')
  .get(getABootcampReviews)
  .post(protect, authorize('publisher', 'admin', 'user'), postABootcampReview)



module.exports = theRouter;