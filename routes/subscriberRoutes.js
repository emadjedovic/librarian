const router = require("express").Router();
const subscribersController = require("../controllers/subscribersController");

router.get("/", subscribersController.index, subscribersController.indexView);
router.get("/new", subscribersController.newSubscriber);
router.post(
  "/create",
  subscribersController.createSubscriber,
  subscribersController.redirectView
);
router.get(
  "/:id",
  subscribersController.showSubscriber,
  subscribersController.showView
);
router.get("/:id/edit", subscribersController.showEdit);
// Process data from the edit form, and display the subscriber show page.
router.put(
  "/:id/update",
  subscribersController.updateSubscriber,
  subscribersController.redirectView
);
router.delete(
  "/:id/delete",
  subscribersController.deleteSubscriber,
  subscribersController.redirectView
);

module.exports = router;
