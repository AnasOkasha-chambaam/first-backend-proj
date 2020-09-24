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
  theRouter = theSecExpress.Router({
    mergeParams: true
  }),
  {
    protect,
    authorize,
    makeSure
  } = require('../middleware/auth')

theRouter.route('/bootcamps')
  .get(getAllBootcamps)
  .post(protect, addOneBootcamp)

theRouter.route('/bootcamps/:id')
  .get(getOneBootcamp)
  .put(protect, authorize('publisher', 'admin'), makeSure('update this bootcamp'), updateOneBootcamp)
  .delete(protect, authorize('publisher', 'admin'), makeSure('delete this bootcamp'), deleteOneBootcamp)

theRouter.route('/bootcamps/:id/photo')
  .put(protect, authorize('publisher', 'admin'), makeSure('update this bootcamp photo'), uploadAPhoto)

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

module.exports = theRouter;