const theSecExpress = require('express'),
  {
    getAllBootcamps,
    getOneBootcamp,
    addOneBootcamp,
    updateOneBootcamp,
    deleteOneBootcamp
  } = require('../controller/bootcamps'),
  theRouter = theSecExpress.Router();

theRouter.route('/')
  .get(getAllBootcamps)
  .post(addOneBootcamp)

theRouter.route('/:id')
  .get(getOneBootcamp)
  .put(updateOneBootcamp)
  .delete(deleteOneBootcamp)

module.exports = theRouter;