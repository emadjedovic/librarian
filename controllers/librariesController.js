const Library = require("../models/library");

const getLibraryParams = (body) => {
  return {
    name: body.name,
    address: body.address,
    zipCode: parseInt(body.zipCode),
    contact: {
      phone: body.phone,
      email: body.email,
      website: body.website
    },
    openingHours: {
      monday: { open: body.mondayOpen, close: body.mondayClose },
      tuesday: { open: body.tuesdayOpen, close: body.tuesdayClose },
      wednesday: { open: body.wednesdayOpen, close: body.wednesdayClose },
      thursday: { open: body.thursdayOpen, close: body.thursdayClose },
      friday: { open: body.fridayOpen, close: body.fridayClose },
      saturday: { open: body.saturdayOpen, close: body.saturdayClose },
      sunday: { open: body.sundayOpen, close: body.sundayClose },
    },
    membershipFee: parseFloat(body.membershipFee),
    rulesAndPolicies: body.rulesAndPolicies,
    books: body.books,  // Expecting this to be an array of book IDs
  };
};


// store the user data on the response and call the next middleware function
const index = (req, res, next) => {
  Library.find()
    .then((libraries) => {
      res.locals.libraries = libraries;
      console.log("fetching...")
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
      req.flash("success", `${library.name} library created successfully!`);
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
      req.flash("success", `${library.name} library updated successfully!`);
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

const { body, validationResult } = require("express-validator");

const validateLibrary = [
  body('name')
    .trim()
    .notEmpty().withMessage('Library name is required')
    .isLength({ min: 2 }).withMessage('Library name must be at least 2 characters long'),
  
  body('address')
    .trim()
    .notEmpty().withMessage('Library address is required')
    .isLength({ min: 5 }).withMessage('Library address must be at least 5 characters long'),

  body('zipCode')
    .optional()  // Optional, since zipCode is not required in your schema
    .isLength({ min: 4, max: 5 }).withMessage('Zip code must be between 4 and 5 characters')
    .isNumeric().withMessage('Zip code must contain only numbers'),

  body('contact.phone')
    .optional()
    .isMobilePhone().withMessage('Please provide a valid phone number'),

  body('contact.email')
    .optional()
    .isEmail().withMessage('Please provide a valid email address'),

  body('membershipFee')
    .optional()
    .isFloat({ min: 0 }).withMessage('Membership fee must be a non-negative number'),

  body('rulesAndPolicies')
    .optional()
    .isLength({ max: 500 }).withMessage('Rules and policies must be under 500 characters'),

  // Validate opening hours format (optional or string in HH:MM format)
  body('openingHours.*.open')
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Opening time must be in HH:MM format'),

  body('openingHours.*.close')
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Closing time must be in HH:MM format'),

  // Middleware to check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

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
  validateLibrary
};
