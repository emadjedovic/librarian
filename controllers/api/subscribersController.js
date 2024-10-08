const Subscriber = require("../../models/subscriber");
const StatusCodes = require("http-status-codes").StatusCodes;


const index = (req, res, next) => {
  Subscriber.find({})
    .then((subscribers) => {
      res.locals.subscribers = subscribers;
      next();
    })
    .catch((error) => {
      console.log(`Error fetching subscribers: ${error.message}`);
      next(error);
    });
};


const showSubscriber = (req, res, next) => {
  let subscriberId = req.params.id;
  Subscriber.findById(subscriberId)
    .then((subscriber) => {
      res.locals.subscriber = subscriber;
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

module.exports = {
  index,
  showSubscriber,
  respondJSON,
  errorJSON
};
