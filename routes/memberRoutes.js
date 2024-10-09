const router = require("express").Router();
const membersController = require("../controllers/membersController");

// When membersController.index completes your query and adds your data
// to the res object, indexView is called to render the view.
router.get("/", membersController.index, membersController.indexView);
router.get("/new", membersController.newMember);
// determine whether data meets the requirements to continue to the create action
router.post(
  "/create",
  membersController.validate,
  membersController.createMember,
  membersController.redirectView
);
router.get("/login", membersController.login);
router.post("/login", membersController.authenticate);
router.get("/logout", membersController.logout, membersController.redirectView);
router.get("/:id", membersController.showMember, membersController.showView);
router.get("/:id/edit", membersController.showEdit);
// Process data from the edit form, and display the member show page.
router.put(
  "/:id/update",
  membersController.updateMember,
  membersController.redirectView
);
router.delete(
  "/:id/delete",
  membersController.deleteMember,
  membersController.redirectView
);

module.exports = router;
