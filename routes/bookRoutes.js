const router = require("express").Router()
const booksController = require("../controllers/booksController");

router.get("/", booksController.index, booksController.indexView);
router.get("/new", booksController.newBook);
router.post("/create",
  booksController.createBook,
  booksController.redirectView
);
router.get("/:id",
  booksController.showBook,
  booksController.showView
);
router.get("/:id/edit", booksController.showEdit);
router.put("/:id/update",
  booksController.updateBook,
  booksController.redirectView
);
router.delete("/:id/delete",
  booksController.deleteBook,
  booksController.redirectView
);


module.exports = router;