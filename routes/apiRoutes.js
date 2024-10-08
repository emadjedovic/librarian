// (instead of query ?format=json)

const router = require("express").Router();
const coursesController = require("../controllers/coursesController");
const usersController = require("../controllers/usersController");
const subscribersController = require("../controllers/subscribersController");

// COURSES

// router.get("/courses", coursesController.index, coursesController.respondJSON);
router.get(
  "/courses",
  coursesController.index,
  coursesController.filterUserCourses,
  coursesController.respondJSON
);
router.get(
  "/courses/:id",
  coursesController.showCourse,
  coursesController.respondJSON
);
router.get(
  "/courses/:id/join",
  coursesController.joinCourse,
  coursesController.respondJSON
);

// USERS

router.get("/users", usersController.index, usersController.respondJSON);
/*
router.post(
  "/users/create",
  usersController.validate,
  usersController.createUser,
  usersController.respondJSON
);
*/
router.get("/users/:id", usersController.showUser, usersController.respondJSON);

// SUBSCRIBERS

router.get(
  "/subscribers",
  subscribersController.index,
  subscribersController.respondJSON
);
router.get(
  "/subscribers/:id",
  subscribersController.showSubscriber,
  subscribersController.respondJSON
);

router.use(coursesController.errorJSON);

module.exports = router;
