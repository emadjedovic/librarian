const Course = require("../models/course");
const User = require("../models/user");
const StatusCodes = require("http-status-codes").StatusCodes;

const getCourseParams = (body) => {
  return {
    title: body.title,
    description: body.description,
    maxStudents: parseInt(body.maxStudents),
    cost: parseInt(body.cost),
    //zipCode: body.zipCode
  };
};

// store the user data on the response and call the next middleware function
const index = (req, res, next) => {
  Course.find()
    .then((courses) => {
      res.locals.courses = courses;
      next();
    })
    .catch((error) => {
      console.log(`Error fetching courses: ${error.message}`);
      next(error);
    });
};

// seperate action for rendering the view
const indexView = (req, res) => {
  if (req.query.format === "json") {
    res.json(res.locals.courses);
  } else {
    res.render("courses/index");
  }
};

// the new action
const newCourse = (req, res) => {
  res.render("courses/new");
};

// the create action
const createCourse = (req, res, next) => {
  let courseParams = getCourseParams(req.body);

  Course.create(courseParams)
    .then((course) => {
      res.locals.redirect = "/courses";
      res.locals.course = course;
      // success flash message
      req.flash("success", `${course.title} course created successfully!`);
      next();
    })
    .catch((error) => {
      req.flash("error", `Failed to create course because: ${error.message}.`);
      console.log(`Error saving course: ${error.message}`);
      next(error);
    });
};

const redirectView = (req, res, next) => {
  let redirectPath = res.locals.redirect;
  if (redirectPath) res.redirect(redirectPath);
  else next();
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

const showView = (req, res) => {
  if (req.query.format === "json") {
    res.json(res.locals.course);
  } else {
    res.render("courses/show");
  }
};

const showEdit = (req, res, next) => {
  let courseId = req.params.id;
  Course.findById(courseId)
    .then((course) => {
      res.render("courses/edit", {
        course,
      });
    })
    .catch((error) => {
      console.log(`Error fetching course by ID: ${error.message}`);
      next(error);
    });
};

const updateCourse = (req, res, next) => {
  let courseId = req.params.id;
  const courseParams = getCourseParams(req.body);
  Course.findByIdAndUpdate(courseId, {
    $set: courseParams,
  })
    .then((course) => {
      res.locals.redirect = `/courses/${courseId}`; // call redirectView afterwards
      res.locals.course = course;
      // success flash message
      req.flash("success", `${course.title} course updated successfully!`);
      next();
    })
    .catch((error) => {
      console.log(`Error updating course by ID: ${error.message}`);
      req.flash("error", `Failed to update course because: ${error.message}.`);
      next(error);
    });
};

const deleteCourse = (req, res, next) => {
  let courseId = req.params.id;
  Course.findByIdAndDelete(courseId)
    .then(() => {
      res.locals.redirect = "/courses";
      // success flash message
      req.flash("success", `Course deleted successfully!`);
      next();
    })
    .catch((error) => {
      console.log(`Error deleting course by ID: ${error.message}`);
      req.flash("error", `Failed to delete course because: ${error.message}.`);
      next();
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
  getCourseParams,
  index,
  indexView,
  newCourse,
  createCourse,
  redirectView,
  showCourse,
  showView,
  showEdit,
  updateCourse,
  deleteCourse,
  respondJSON,
  errorJSON,
  joinCourse,
  filterUserCourses,
};
