const Course = require("../../models/course");
const User = require("../../models/user");
const StatusCodes = require("http-status-codes").StatusCodes;

// store the user data on the response and call the next middleware function
const index = (req, res, next) => {
  Course.find()
    .then((courses) => {
      console.log(`Fetched ${courses.length} courses.`); // says fetched 3 courses
      res.locals.courses = courses;
      next();
    })
    .catch((error) => {
      console.log(`Error fetching courses: ${error.message}`);
      next(error);
    });
};


const showCourse = (req, res, next) => {
  let courseId = req.params.id;
  Course.findById(courseId)
    .then((course) => {
      res.locals.course = course;
      next();
    })
    .catch((error) => {
      console.log(`Error fetching course by ID: ${error.message}`);
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

const joinCourse = (req, res, next) => {
  let courseId = req.params.id;
  const currentUser = req.user;
  // check whether a user is logged in
  if (currentUser) {
    User.findByIdAndUpdate(currentUser, {
      $addToSet: {
        courses: courseId,
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

const filterUserCourses = (req, res, next) => {
  let currentUser = res.locals.currentUser;
  // check whether a user is logged in
  if (currentUser) {
    let mappedCourses = res.locals.courses.map((course) => {
      let userJoined = currentUser.courses.some((userCourse) => {
        // Check whether the course exists in the user’s courses array.
        return userCourse.equals(course._id);
      });
      // Modify course to add a flag indicating user association.
      return Object.assign(course.toObject(), { joined: userJoined });
    });
    res.locals.courses = mappedCourses;
    next();
  } else {
    next();
  }
};

module.exports = {
  index,
  showCourse,
  respondJSON,
  errorJSON,
  joinCourse,
  filterUserCourses,
};
