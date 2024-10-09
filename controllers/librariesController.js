const Library = require("../models/library");

const getLibraryParams = (body) => {
  return {
    title: body.title,
    description: body.description,
    maxStudents: parseInt(body.maxStudents),
    cost: parseInt(body.cost),
  };
};

// store the member data on the response and call the next middleware function
const index = (req, res, next) => {
  Library.find()
    .then((libraries) => {
      res.locals.libraries = libraries;
      next();
    })
    .catch((error) => {
      console.log(`Error fetching libraries: ${error.message}`);
      next(error);
    });
};

// seperate action for rendering the view
const indexView = (req, res) => {
  res.render("libraries/index");
};

// the new action
const newLibrary = (req, res) => {
  res.render("libraries/new");
};

// the create action
const createLibrary = (req, res, next) => {
  let libraryParams = getLibraryParams(req.body);

  Library.create(libraryParams)
    .then((library) => {
      res.locals.redirect = "/libraries";
      res.locals.library = library;
      // success flash message
      req.flash("success", `${library.title} library created successfully!`);
      next();
    })
    .catch((error) => {
      req.flash("error", `Failed to create library because: ${error.message}.`);
      console.log(`Error saving library: ${error.message}`);
      next(error);
    });
};

const redirectView = (req, res, next) => {
  let redirectPath = res.locals.redirect;
  if (redirectPath) res.redirect(redirectPath);
  else next();
};

const showLibrary = (req, res, next) => {
  let libraryId = req.params.id;
  Library.findById(libraryId)
    .then((library) => {
      res.locals.library = library;
      next();
    })
    .catch((error) => {
      console.log(`Error fetching library by ID: ${error.message}`);
      next(error);
    });
};

const showView = (req, res) => {
  res.render("libraries/show");
};

const showEdit = (req, res, next) => {
  let libraryId = req.params.id;
  Library.findById(libraryId)
    .then((library) => {
      res.render("libraries/edit", {
        library,
      });
    })
    .catch((error) => {
      console.log(`Error fetching library by ID: ${error.message}`);
      next(error);
    });
};

const updateLibrary = (req, res, next) => {
  let libraryId = req.params.id;
  const libraryParams = getLibraryParams(req.body);
  Library.findByIdAndUpdate(libraryId, {
    $set: libraryParams,
  })
    .then((library) => {
      res.locals.redirect = `/libraries/${libraryId}`; // call redirectView afterwards
      res.locals.library = library;
      // success flash message
      req.flash("success", `${library.title} library updated successfully!`);
      next();
    })
    .catch((error) => {
      console.log(`Error updating library by ID: ${error.message}`);
      req.flash("error", `Failed to update library because: ${error.message}.`);
      next(error);
    });
};

const deleteLibrary = (req, res, next) => {
  let libraryId = req.params.id;
  Library.findByIdAndDelete(libraryId)
    .then(() => {
      res.locals.redirect = "/libraries";
      // success flash message
      req.flash("success", `Library deleted successfully!`);
      next();
    })
    .catch((error) => {
      console.log(`Error deleting library by ID: ${error.message}`);
      req.flash("error", `Failed to delete library because: ${error.message}.`);
      next();
    });
};

module.exports = {
  getLibraryParams,
  index,
  indexView,
  newLibrary,
  createLibrary,
  redirectView,
  showLibrary,
  showView,
  showEdit,
  updateLibrary,
  deleteLibrary,
};
