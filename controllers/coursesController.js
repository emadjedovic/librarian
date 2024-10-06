const Course = require("../models/course");

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
  res.render("courses/index");
};

// the new action
const newCourse = (req, res) => {
  res.render("courses/new");
};

// the create action
const createCourse = (req, res, next) => {
  let courseParams = {
    title: req.body.title,
    description: req.body.description,
    zipCode: req.body.zipCode,
  };

  Course.create(courseParams)
    .then((course) => {
      res.locals.redirect = "/courses";
      res.locals.course = course;
      next();
    })
    .catch((error) => {
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
  res.render("courses/show");
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
  let courseId = req.params.id,
    courseParams = {
      title: req.body.title,
      description: req.body.description,
      zipCode: req.body.zipCode,
    };
  Course.findByIdAndUpdate(courseId, {
    $set: courseParams,
  })
    .then((course) => {
      res.locals.redirect = `/courses/${courseId}`; // call redirectView afterwards
      res.locals.course = course;
      next();
    })
    .catch((error) => {
      console.log(`Error updating course by ID: ${error.message}`);
      next(error);
    });
};

const deleteCourse = (req, res, next) => {
  let courseId = req.params.id;
  Course.findByIdAndDelete(courseId)
    .then(() => {
      res.locals.redirect = "/courses";
      next();
    })
    .catch((error) => {
      console.log(`Error deleting course by ID: ${error.message}`);
      next();
    });
};

module.exports = {
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
};
