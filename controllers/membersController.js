const Member = require("../models/member");
const passport = require("passport");
const jsonWebToken = require("jsonwebtoken");

const getMemberParams = (body) => {
  return {
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    zipCode: parseInt(body.zipCode),
  };
};

// store the member data on the response and call the next middleware function
const index = (req, res, next) => {
  Member.find()
    .then((members) => {
      res.locals.members = members;
      next();
    })
    .catch((error) => {
      console.log(`Error fetching members: ${error.message}`);
      next(error);
    });
};

const indexView = (req, res) => {
  res.render("members/index");
};

// the new action
const newMember = (req, res) => {
  res.render("members/new");
};

// the create action
const createMember = (req, res, next) => {
  if (req.skip) next();
  let newMember = new Member(getMemberParams(req.body));
  Member.register(newMember, req.body.password, (error, member) => {
    if (member) {
      req.flash("success", `${member.fullName}'s account created successfully!`);
      res.locals.redirect = "/members";
      next();
    } else {
      req.flash(
        "error",
        `Failed to create member account because: ${error.message}.`
      );
      res.locals.redirect = "/members/new";
      next();
    }
  });
};

const redirectView = (req, res, next) => {
  let redirectPath = res.locals.redirect;
  if (redirectPath) res.redirect(redirectPath);
  else next();
};

const showMember = (req, res, next) => {
  let memberId = req.params.id;
  Member.findById(memberId)
    .then((member) => {
      res.locals.member = member;
      next();
    })
    .catch((error) => {
      console.log(`Error fetching member by ID: ${error.message}`);
      next(error);
    });
};

const showView = (req, res) => {
  res.render("members/show");
};

const showEdit = (req, res, next) => {
  let memberId = req.params.id;
  Member.findById(memberId)
    .then((member) => {
      res.render("members/edit", {
        member,
      });
    })
    .catch((error) => {
      console.log(`Error fetching member by ID: ${error.message}`);
      next(error);
    });
};

const updateMember = (req, res, next) => {
  let memberId = req.params.id;
  const memberParams = getMemberParams(req.body);
  Member.findByIdAndUpdate(memberId, {
    $set: memberParams,
  })
    .then((member) => {
      res.locals.redirect = `/members/${memberId}`; // call redirectView afterwards
      res.locals.member = member;
      // success flash message
      req.flash("success", `${member.fullName} updated successfully!`);
      next();
    })
    .catch((error) => {
      console.log(`Error updating member by ID: ${error.message}`);
      req.flash("error", `Failed to update member because: ${error.message}.`);
      next(error);
    });
};

const deleteMember = (req, res, next) => {
  let memberId = req.params.id;
  Member.findByIdAndDelete(memberId)
    .then(() => {
      res.locals.redirect = "/members";
      // success flash message
      req.flash("success", `Member deleted successfully!`);
      next();
    })
    .catch((error) => {
      console.log(`Error deleting member by ID: ${error.message}`);
      req.flash("error", `Failed to delete member because: ${error.message}.`);
      next();
    });
};

const login = (req, res) => {
  res.render("members/login");
};

// authenticate using local strategy
const authenticate = (req, res, next) => {
  passport.authenticate("local", (error, member, info) => {
    if (error) {
      req.flash("error", "Authentication error.");
      return res.redirect("/members/login");
    }

    if (!member) {
      req.flash("error", "Failed to login.");
      return res.redirect("/members/login");
    }

    // Successfully authenticated
    req.login(member, (loginError) => {
      if (loginError) {
        req.flash("error", "Login failed.");
        return res.redirect("/members/login");
      }

      // Generate a token
      const signedToken = jsonWebToken.sign(
        {
          data: member._id,
        },
        "secret_encoding_passphrase",
        { expiresIn: "1d" } // Set expiration to 1 day
      );

      req.session.token = signedToken;

      req.flash("success", "Logged in!");
      return res.redirect("/"); // Redirect to home page
    });
  })(req, res, next);
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err); // handle error during logout
    }
    req.flash("success", "You have been logged out!");
    res.locals.redirect = "/";
    next();
  });
};

const { body, validationResult } = require("express-validator");

const validate = [
  // Sanitize and validate the email
  body("email")
    .normalizeEmail({ all_lowercase: true })
    .trim()
    .isEmail()
    .withMessage("Email is invalid"),

  // Validate the zip code: not empty, must be an integer, and exactly 5 characters long
  body("zipCode")
    .notEmpty()
    .withMessage("Zip code is required")
    .isInt()
    .withMessage("Zip code must be a number")
    .isLength({ min: 4, max: 5 })
    .withMessage("Zip code must be between 4 and 5 digits"),

  // Validate the password: cannot be empty
  body("password").notEmpty().withMessage("Password cannot be empty"),

  // Handle validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Collect all error messages
      let messages = errors.array().map((e) => e.msg);
      req.flash("error", messages.join(" and "));
      res.locals.redirect = "/members/new"; // Set redirect to the form page
      return res.redirect(res.locals.redirect); // Redirect back to the form with error messages
    }
    next(); // Move to the next middleware if validation passed
  },
];

module.exports = {
  getMemberParams,
  index,
  indexView,
  newMember,
  createMember,
  redirectView,
  showMember,
  showView,
  showEdit,
  updateMember,
  deleteMember,
  login,
  authenticate,
  validate,
  logout,
};
