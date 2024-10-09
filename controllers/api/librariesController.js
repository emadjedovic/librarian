const Library = require("../../models/library");
const Member = require("../../models/member");
const StatusCodes = require("http-status-codes").StatusCodes;

// store the member data on the response and call the next middleware function
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
  const currentMember = req.member;
  // check whether a member is logged in
  if (currentMember) {
    Member.findByIdAndUpdate(currentMember, {
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
    next(new Error("Member must log in."));
  }
};

const filterMemberLibraries = (req, res, next) => {
  let currentMember = res.locals.currentMember;
  // check whether a member is logged in
  if (currentMember) {
    let mappedLibraries = res.locals.libraries.map((library) => {
      let memberJoined = currentMember.libraries.some((memberLibrary) => {
        // Check whether the library exists in the member’s libraries array.
        return memberLibrary.equals(library._id);
      });
      // Modify library to add a flag indicating member association.
      return Object.assign(library.toObject(), { joined: memberJoined });
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
  filterMemberLibraries,
};
