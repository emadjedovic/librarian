const User = require("../../models/user");
const StatusCodes = require("http-status-codes").StatusCodes;
// verify incoming API requests
const token = process.env.TOKEN || "recipeT0k3n";

const getUserParams = (body) => {
  return {
    name: {
      first: body.name.first,
      last: body.name.last,
    },
    email: body.email,
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

const verifyToken = (req, res, next) => {
  let token = req.query.apiToken;
  if (token) {
    User.findOne({ apiToken: token })
      .then((user) => {
        if (user) next();
        else next(new Error("Invalid API token."));
      })
      .catch((error) => {
        next(new Error(error.message));
      });
  } else {
    next(new Error("Invalid API token."));
  }
};

const createUser = (req, res, next) => {
  if (req.skip) next();
  let newUser = new User(getUserParams(req.body));
  User.register(newUser, req.body.password, (error, user) => {
    if (user) {
      next();
    } else {
      next(new Error(error.message));
    }
  });
};

module.exports = {
  getUserParams,
  index,
  showUser,
  respondJSON,
  errorJSON,
  verifyToken,
  createUser,
};
