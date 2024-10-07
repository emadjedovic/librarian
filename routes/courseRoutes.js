const router = require("express").Router()
const coursesController = require("../controllers/coursesController");

router.get("/", coursesController.index, coursesController.indexView);
router.get("/new", coursesController.newCourse);
router.post("/create",
  coursesController.createCourse,
  coursesController.redirectView
);
router.get("/:id",
  coursesController.showCourse,
  coursesController.showView
);
router.get("/:id/edit", coursesController.showEdit);
router.put("/:id/update",
  coursesController.updateCourse,
  coursesController.redirectView
);
router.delete("/:id/delete",
  coursesController.deleteCourse,
  coursesController.redirectView
);


module.exports = router;