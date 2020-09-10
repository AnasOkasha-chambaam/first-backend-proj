const theSecExpress = require('express'),
  {
    getAllBootcamps,
    getOneBootcamp,
    addOneBootcamp,
    updateOneBootcamp,
    deleteOneBootcamp
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
  });

theRouter.route('/bootcamps')
  .get(getAllBootcamps)
  .post(addOneBootcamp)

theRouter.route('/bootcamps/:id')
  .get(getOneBootcamp)
  .put(updateOneBootcamp)
  .delete(deleteOneBootcamp)

theRouter.route('/courses')
  .get(getAllCourses)
  .post(postACourse)

theRouter.route('/courses/:id')
  .put(updateACourse)
  .get(getACourse)
  .delete(deleteACourse)

theRouter.route('/bootcamps/:bootcampIDD/courses')
  .get(getABootcampCourses)
  .post(postABootcampCourse)
module.exports = theRouter;