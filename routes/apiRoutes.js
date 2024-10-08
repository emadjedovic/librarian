const router = require("express").Router();
const coursesController = require("../controllers/api/coursesController");
const usersController = require("../controllers/api/usersController");
const subscribersController = require("../controllers/api/subscribersController");

// runs before every API request is handled
router.use(usersController.verifyToken);

// COURSES
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
router.post(
    "/users/create",
    usersController.createUser,
    usersController.respondJSON
  );
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
