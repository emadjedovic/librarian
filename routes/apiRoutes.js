const router = require("express").Router();
const librariesController = require("../controllers/api/librariesController");
const usersController = require("../controllers/api/usersController");
const booksController = require("../controllers/api/booksController")
const redirectView = require("../controllers/usersController").redirectView

// every route needs to use the verifyJWT middleware except for
// the login route, which is used to generate JWT
router.post("/login", usersController.apiAuthenticate, redirectView)
router.use(usersController.verifyJWT)

// LIBRARIES
router.get(
  "/libraries",
  librariesController.index,
  librariesController.filterUserLibraries,
  librariesController.respondJSON
);
router.get(
  "/libraries/:id",
  librariesController.showLibrary,
  librariesController.respondJSON
);
router.get(
  "/libraries/:id/join",
  librariesController.joinLibrary,
  librariesController.respondJSON
);

// BOOKS
router.get("/books", booksController.index, booksController.respondJSON)
router.get("/books/:id", booksController.showBook, booksController.respondJSON)

// USERS
router.get("/users", usersController.index, usersController.respondJSON);
router.post(
    "/users/create",
    usersController.createUser,
    usersController.respondJSON
  );
router.get("/users/:id", usersController.showUser, usersController.respondJSON);

router.use(librariesController.errorJSON);

module.exports = router;
