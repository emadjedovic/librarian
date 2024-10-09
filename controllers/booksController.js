const Book = require("../models/book");

const getBookParams = (body) => {
  return {
    title: body.title,
    author: body.author,
    ISBN: body.ISBN,
    genre: body.genre,
    publishedDate: body.publishedDate,
    pages: parseInt(body.pages),
    availableCopies: parseInt(body.availableCopies),
    summary: body.summary,
    library: body.library, // Expecting this to be a library ID
  };
};

// Display all books
const index = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.locals.books = books;
      next();
    })
    .catch((error) => {
      console.log(`Error fetching books: ${error.message}`);
      next(error);
    });
};

// Render index view for books
const indexView = (req, res) => {
  res.render("books/index");
};

// Display new book form
const newBook = (req, res) => {
  res.render("books/new");
};

// Create a new book
const createBook = (req, res, next) => {
  let bookParams = getBookParams(req.body);

  Book.create(bookParams)
    .then((book) => {
      res.locals.redirect = "/books";
      res.locals.book = book;
      req.flash("success", `${book.title} created successfully!`);
      next();
    })
    .catch((error) => {
      req.flash("error", `Failed to create book: ${error.message}`);
      console.log(`Error saving book: ${error.message}`);
      next(error);
    });
};

// Redirect to a specific view
const redirectView = (req, res, next) => {
  let redirectPath = res.locals.redirect;
  if (redirectPath) res.redirect(redirectPath);
  else next();
};

// Show a specific book by ID
const showBook = (req, res, next) => {
  let bookId = req.params.id;
  Book.findById(bookId)
    .populate("library")
    .then((book) => {
      res.locals.book = book;
      next();
    })
    .catch((error) => {
      console.log(`Error fetching book by ID: ${error.message}`);
      next(error);
    });
};

// Render book detail view
const showView = (req, res) => {
  res.render("books/show");
};

// Display book edit form
const showEdit = (req, res, next) => {
  let bookId = req.params.id;
  Book.findById(bookId)
    .then((book) => {
      res.render("books/edit", {
        book,
      });
    })
    .catch((error) => {
      console.log(`Error fetching book by ID: ${error.message}`);
      next(error);
    });
};

// Update a specific book
const updateBook = (req, res, next) => {
  let bookId = req.params.id;
  const bookParams = getBookParams(req.body);
  Book.findByIdAndUpdate(bookId, {
    $set: bookParams,
  })
    .then((book) => {
      res.locals.redirect = `/books/${bookId}`;
      res.locals.book = book;
      req.flash("success", `${book.title} updated successfully!`);
      next();
    })
    .catch((error) => {
      console.log(`Error updating book: ${error.message}`);
      req.flash("error", `Failed to update book: ${error.message}`);
      next(error);
    });
};

// Delete a book by ID
const deleteBook = (req, res, next) => {
  let bookId = req.params.id;
  Book.findByIdAndDelete(bookId)
    .then(() => {
      res.locals.redirect = "/books";
      req.flash("success", `Book deleted successfully!`);
      next();
    })
    .catch((error) => {
      console.log(`Error deleting book: ${error.message}`);
      req.flash("error", `Failed to delete book: ${error.message}`);
      next(error);
    });
};

// Validation middleware for books
const { body, validationResult } = require("express-validator");

const validateBook = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 2 }).withMessage("Title must be at least 2 characters long"),

  body("author")
    .trim()
    .notEmpty().withMessage("Author is required")
    .isLength({ min: 2 }).withMessage("Author must be at least 2 characters long"),

  body("ISBN")
    .trim()
    .notEmpty().withMessage("ISBN is required")
    .isLength({ min: 13, max: 13 }).withMessage("ISBN must be 13 characters long"),

  body("genre")
    .notEmpty().withMessage("Genre is required"),

  body("publishedDate")
    .notEmpty().withMessage("Published date is required")
    .isISO8601().withMessage("Please provide a valid date"),

  body("pages")
    .optional()
    .isInt({ min: 1 }).withMessage("Pages must be a positive number"),

  body("availableCopies")
    .optional()
    .isInt({ min: 0 }).withMessage("Available copies must be a non-negative number"),

  // Middleware to check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  getBookParams,
  index,
  indexView,
  newBook,
  createBook,
  redirectView,
  showBook,
  showView,
  showEdit,
  updateBook,
  deleteBook,
  validateBook,
};
