const Subscriber = require("../models/subscriber");

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

const indexView = (req, res) => {
  res.render("subscribers/index");
};

const newSubscriber = (req, res) => {
  res.render("subscribers/new");
};

const createSubscriber = (req, res, next) => {
  let subscriberParams = {
    name: req.body.name,
    email: req.body.email,
    zipCode: req.body.zipCode,
  };

  Subscriber.create(subscriberParams)
    .then((subscriber) => {
      res.locals.redirect = "/thanks";
      res.locals.subscriber = subscriber;
      next();
    })
    .catch((error) => {
      console.log(`Error saving subscriber: ${error.message}`);
      next(error);
    });
};

const redirectView = (req, res, next) => {
  let redirectPath = res.locals.redirect;
  if (redirectPath) res.redirect(redirectPath);
  else next();
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

const showView = (req, res) => {
  res.render("subscribers/show");
};

const showEdit = (req, res, next) => {
  let subscriberId = req.params.id;
  Subscriber.findById(subscriberId)
    .then((subscriber) => {
      res.render("subscribers/edit", {
        subscriber,
      });
    })
    .catch((error) => {
      console.log(`Error fetching subscriber by ID: ${error.message}`);
      next(error);
    });
};
const updateSubscriber = (req, res, next) => {
  let subscriberId = req.params.id,
    subscriberParams = {
      name: req.body.name,
      email: req.body.email,
      zipCode: req.body.zipCode,
    };
  Subscriber.findByIdAndUpdate(subscriberId, {
    $set: subscriberParams,
  })
    .then((subscriber) => {
      res.locals.redirect = `/subscribers/${subscriberId}`; // call redirectView afterwards
      res.locals.subscriber = subscriber;
      next();
    })
    .catch((error) => {
      console.log(`Error updating subscriber by ID: ${error.message}`);
      next(error);
    });
};

const deleteSubscriber = (req, res, next) => {
  let subscriberId = req.params.id;
  Subscriber.findByIdAndDelete(subscriberId)
    .then(() => {
      res.locals.redirect = "/subscribers";
      next();
    })
    .catch((error) => {
      console.log(`Error deleting subscriber by ID: ${error.message}`);
      next();
    });
};

module.exports = {
  index,
  indexView,
  newSubscriber,
  createSubscriber,
  redirectView,
  showSubscriber,
  showView,
  showEdit,
  updateSubscriber,
  deleteSubscriber,
};
