const User = require("../../models/user");
const StatusCodes = require("http-status-codes").StatusCodes;
const jsonWebToken = require("jsonwebtoken");
const passport = require("passport");

// Function to extract user parameters from the request body
const getUserParams = (body) => {
  return {
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    zipCode: parseInt(body.zipCode),
  };
};

// Fetch all users
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

// Fetch a specific user by ID
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

// Respond with user data in JSON format
const respondJSON = (req, res) => {
  res.json({
    status: StatusCodes.OK,
    data: res.locals,
  });
};

// Handle errors and respond in JSON format
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

// Middleware to verify JWT for protected routes
const verifyJWT = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from the Authorization header
  if (token) {
    jsonWebToken.verify(
      token,
      "secret_encoding_passphrase",
      (error, payload) => {
        if (error) {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            error: true,
            message: "Invalid or expired token.",
          });
        }
        // Attach user data to the request for further processing
        User.findById(payload.data).then((user) => {
          if (user) {
            req.user = user; // Attach user to request object
            next();
          } else {
            res.status(StatusCodes.FORBIDDEN).json({
              error: true,
              message: "No User account found.",
            });
          }
        });
      }
    );
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({
      error: true,
      message: "Token is required.",
    });
  }
};

// Create a new user
const createUser = (req, res, next) => {
  let newUser = new User(getUserParams(req.body));
  User.register(newUser, req.body.password, (error, user) => {
    if (error) {
      return next(new Error(error.message));
    }
    // Automatically authenticate after registration
    passport.authenticate("local")(req, res, () => {
      res.json({
        success: true,
        message: "User created successfully.",
      });
    });
  });
};

// Authenticate user and generate JWT

const apiAuthenticate = (req, res, next) => {
  passport.authenticate("local", (errors, user) => {
    if (user) {
      const signedToken = jsonWebToken.sign(
        {
          data: user._id,
        },
        "secret_encoding_passphrase",
        { expiresIn: "1d" } // Set expiration to 1 day
      );
      req.session.token = signedToken
      res.json({
        success: true,
        token: signedToken,
      });
    } else {
      res.json({
        success: false,
        message: "Could not authenticate user.",
      });
    }
  })(req, res, next);
};


module.exports = {
  getUserParams,
  index,
  showUser,
  respondJSON,
  errorJSON,
  verifyJWT,
  createUser,
  apiAuthenticate,
};
