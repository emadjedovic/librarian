const router = require("express").Router()
const librariesController = require("../controllers/librariesController");

router.get("/", librariesController.index, librariesController.indexView);
router.get("/new", librariesController.newLibrary);
router.post("/create",
  librariesController.createLibrary,
  librariesController.redirectView
);
router.get("/:id",
  librariesController.showLibrary,
  librariesController.showView
);
router.get("/:id/edit", librariesController.showEdit);
router.put("/:id/update",
  librariesController.updateLibrary,
  librariesController.redirectView
);
router.delete("/:id/delete",
  librariesController.deleteLibrary,
  librariesController.redirectView
);


module.exports = router;