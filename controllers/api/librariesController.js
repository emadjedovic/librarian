const Library = require("../../models/library");
const User = require("../../models/user");
const StatusCodes = require("http-status-codes").StatusCodes;

// store the user data on the response and call the next middleware function
const index = (req, res, next) => {
  Library.find()
    .then((libraries) => {
      console.log(`Fetched ${libraries.length} libraries.`);
      res.locals.libraries = libraries;
      next();
    })
    .catch((error) => {
      console.log(`Error fetching libraries: ${error.message}`);
      next(error);
    });
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

const joinLibrary = (req, res, next) => {
  let libraryId = req.params.id;
  const currentUser = req.user;
  // check whether a user is logged in
  if (currentUser) {
    User.findByIdAndUpdate(currentUser, {
      $addToSet: {
        libraries: libraryId,
      },
    })
      .then(() => {
        res.locals.success = true;
        next();
      })
      .catch((error) => {
        next(error);
      });
  } else {
    next(new Error("User must log in."));
  }
};

const filterUserLibraries = (req, res, next) => {
  let currentUser = res.locals.currentMember;
  // check whether a user is logged in
  if (currentUser) {
    let mappedLibraries = res.locals.libraries.map((library) => {
      let userJoined = currentUser.libraries.some((userLibrary) => {
        // Check whether the library exists in the user’s libraries array.
        return userLibrary.equals(library._id);
      });
      // Modify library to add a flag indicating user association.
      return Object.assign(library.toObject(), { joined: userJoined });
    });
    res.locals.libraries = mappedLibraries;
    next();
  } else {
    next();
  }
};

module.exports = {
  index,
  showLibrary,
  respondJSON,
  errorJSON,
  joinLibrary,
  filterUserLibraries,
};
