const Book = require("../../models/book");
const StatusCodes = require("http-status-codes").StatusCodes;

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

const respondJSON = (req, res) => {
  // handle the request from previous middleware
  res.json({
    status: StatusCodes.OK,
    data: res.locals,
  });
};

const errorJSON = (error, req, res, next) => {
  let errorObject;
  if (error) {
    errorObject = {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message,
    };
  } else {
    errorObject = {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Unknown Error.",
    };
  }
  res.json(errorObject);
};

module.exports = {
  index,
  showBook,
  respondJSON,
  errorJSON,
};
