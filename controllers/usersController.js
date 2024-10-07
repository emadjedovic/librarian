const User = require("../models/user");

const getUserParams = (body) => {
  return {
    name: {
      first: body.first,
      last: body.last,
    },
    email: body.email,
    password: body.password,
    zipCode: parseInt(body.zipCode),
  };
};

// store the user data on the response and call the next middleware function
const index = (req, res, next) => {
  User.find()
    .then((users) => {
      res.locals.users = users;
      next();
    })
    .catch((error) => {
      console.log(`Error fetching users: ${error.message}`);
      next(error);
    });
};

// seperate action for rendering the view
const indexView = (req, res) => {
  res.render("users/index");
};

// the new action
const newUser = (req, res) => {
  res.render("users/new");
};

// the create action
const createUser = (req, res, next) => {
  let userParams = getUserParams(req.body);

  User.create(userParams)
    .then((user) => {
      // success flash message
      req.flash("success", `${user.fullName}'s account created successfully!`);
      res.locals.redirect = "/users";
      res.locals.user = user;
      next();
    })
    .catch((error) => {
      console.log(`Error saving user: ${error.message}`);
      res.locals.redirect = "/users/new";
      req.flash(
        "error",
        `Failed to create user account because: ${error.message}.`
      );
      next(error);
    });
};

const redirectView = (req, res, next) => {
  let redirectPath = res.locals.redirect;
  if (redirectPath) res.redirect(redirectPath);
  else next();
};

const showUser = (req, res, next) => {
  let userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      res.locals.user = user;
      next();
    })
    .catch((error) => {
      console.log(`Error fetching user by ID: ${error.message}`);
      next(error);
    });
};

const showView = (req, res) => {
  res.render("users/show");
};

const showEdit = (req, res, next) => {
  let userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      res.render("users/edit", {
        user,
      });
    })
    .catch((error) => {
      console.log(`Error fetching user by ID: ${error.message}`);
      next(error);
    });
};
const updateUser = (req, res, next) => {
  let userId = req.params.id;
  const userParams = getUserParams(req.body);
  User.findByIdAndUpdate(userId, {
    $set: userParams,
  })
    .then((user) => {
      res.locals.redirect = `/users/${userId}`; // call redirectView afterwards
      res.locals.user = user;
      // success flash message
      req.flash("success", `${user.fullName} updated successfully!`);
      next();
    })
    .catch((error) => {
      console.log(`Error updating user by ID: ${error.message}`);
      req.flash("error", `Failed to update user because: ${error.message}.`);
      next(error);
    });
};

const deleteUser = (req, res, next) => {
  let userId = req.params.id;
  User.findByIdAndDelete(userId)
    .then(() => {
      res.locals.redirect = "/users";
      // success flash message
      req.flash("success", `User deleted successfully!`);
      next();
    })
    .catch((error) => {
      console.log(`Error deleting user by ID: ${error.message}`);
      req.flash("error", `Failed to delete user because: ${error.message}.`);
      next();
    });
};

const login = (req, res) => {
  res.render("users/login");
};

const authenticate = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        user.passwordComparison(req.body.password).then((passwordsMatch) => {
          if (passwordsMatch) {
            res.locals.redirect = `/users/${user._id}`;
            req.flash("success", `${user.fullName}'s logged in successfully!`);
            res.locals.user = user;
          } else {
            req.flash(
              "error",
              "Failed to log in user account: Incorrect Password."
            );
            res.locals.redirect = "/users/login";
          }
          next();
        });
      } else {
        req.flash(
          "error",
          "Failed to log in user account: User account not found."
        );
        res.locals.redirect = "/users/login";
        next();
      }
    })
    .catch((error) => {
      console.log(`Error logging in user: ${error.message}`);
      next(error);
    });
};

const {body, validationResult} = require("express-validator")

const validate = [
  // Sanitize and validate the email
  body('email')
    .normalizeEmail({ all_lowercase: true })
    .trim()
    .isEmail()
    .withMessage('Email is invalid'),

  // Validate the zip code: not empty, must be an integer, and exactly 5 characters long
  body('zipCode')
    .notEmpty()
    .withMessage('Zip code is required')
    .isInt()
    .withMessage('Zip code must be a number')
    .isLength({ min: 5, max: 5 })
    .withMessage('Zip code must be exactly 5 digits'),

  // Validate the password: cannot be empty
  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty'),

  // Handle validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Collect all error messages
      let messages = errors.array().map((e) => e.msg);
      req.flash('error', messages.join(' and '));
      res.locals.redirect = '/users/new'; // Set redirect to the form page
      return res.redirect(res.locals.redirect); // Redirect back to the form with error messages
    }
    next(); // Move to the next middleware if validation passed
  }
];


module.exports = {
  getUserParams,
  index,
  indexView,
  newUser,
  createUser,
  redirectView,
  showUser,
  showView,
  showEdit,
  updateUser,
  deleteUser,
  login,
  authenticate,
  validate,
};
