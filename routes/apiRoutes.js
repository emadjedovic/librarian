const router = require("express").Router();
const librariesController = require("../controllers/api/librariesController");
const membersController = require("../controllers/api/membersController");
const redirectView = require("../controllers/membersController").redirectView

// every route needs to use the verifyJWT middleware except for
// the login route, which is used to generate JWT
router.post("/login", membersController.apiAuthenticate, redirectView)
router.use(membersController.verifyJWT)

// COURSES
router.get(
  "/libraries",
  librariesController.index,
  librariesController.filterMemberLibraries,
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

// USERS
router.get("/members", membersController.index, membersController.respondJSON);
router.post(
    "/members/create",
    membersController.createMember,
    membersController.respondJSON
  );
router.get("/members/:id", membersController.showMember, membersController.respondJSON);

router.use(librariesController.errorJSON);

module.exports = router;
