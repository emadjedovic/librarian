const router = require("express").Router();
const coursesController = require("../controllers/api/coursesController");
const usersController = require("../controllers/api/usersController");
const redirectView = require("../controllers/usersController").redirectView
const subscribersController = require("../controllers/api/subscribersController");

// every route needs to use the verifyJWT middleware except for
// the login route, which is used to generate JWT
router.post("/login", usersController.apiAuthenticate, redirectView)
router.use(usersController.verifyJWT)

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
