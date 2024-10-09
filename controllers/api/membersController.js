const Member = require("../../models/member");
const StatusCodes = require("http-status-codes").StatusCodes;
const jsonWebToken = require("jsonwebtoken");
const passport = require("passport");

// Function to extract member parameters from the request body
const getMemberParams = (body) => {
  return {
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    zipCode: parseInt(body.zipCode),
  };
};

// Fetch all members
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

// Fetch a specific member by ID
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

// Respond with member data in JSON format
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
        // Attach member data to the request for further processing
        Member.findById(payload.data).then((member) => {
          if (member) {
            req.member = member; // Attach member to request object
            next();
          } else {
            res.status(StatusCodes.FORBIDDEN).json({
              error: true,
              message: "No Member account found.",
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

// Create a new member
const createMember = (req, res, next) => {
  let newMember = new Member(getMemberParams(req.body));
  Member.register(newMember, req.body.password, (error, member) => {
    if (error) {
      return next(new Error(error.message));
    }
    // Automatically authenticate after registration
    passport.authenticate("local")(req, res, () => {
      res.json({
        success: true,
        message: "Member created successfully.",
      });
    });
  });
};

// Authenticate member and generate JWT

const apiAuthenticate = (req, res, next) => {
  passport.authenticate("local", (errors, member) => {
    if (member) {
      const signedToken = jsonWebToken.sign(
        {
          data: member._id,
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
        message: "Could not authenticate member.",
      });
    }
  })(req, res, next);
};


module.exports = {
  getMemberParams,
  index,
  showMember,
  respondJSON,
  errorJSON,
  verifyJWT,
  createMember,
  apiAuthenticate,
};
