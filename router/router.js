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
    protect
  } = require('../middleware/auth')

theRouter.route('/bootcamps')
  .get(getAllBootcamps)
  .post(protect, addOneBootcamp)

theRouter.route('/bootcamps/:id')
  .get(getOneBootcamp)
  .put(protect, updateOneBootcamp)
  .delete(protect, deleteOneBootcamp)

theRouter.route('/bootcamps/:id/photo')
  .put(protect, uploadAPhoto)

theRouter.route('/courses')
  .get(getAllCourses)
  .post(protect, postACourse)

theRouter.route('/courses/:id')
  .put(protect, updateACourse)
  .get(getACourse)
  .delete(protect, deleteACourse)

theRouter.route('/bootcamps/:bootcampIDD/courses')
  .get(getABootcampCourses)
  .post(protect, postABootcampCourse)
module.exports = theRouter;