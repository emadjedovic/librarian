const Subscriber = require("../models/subscriber");

const getSubscriberParams = (body) => {
  return {
    name: body.name,
    email: body.email,
    zipCode: parseInt(body.zipCode),
  };
};

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
  let subscriberParams = getSubscriberParams(req.body);

  Subscriber.create(subscriberParams)
    .then((subscriber) => {
      res.locals.redirect = "/thanks";
      res.locals.subscriber = subscriber;
      next();
    })
    .catch((error) => {
      console.log(`Error saving subscriber: ${error.message}`);
      req.flash("error", `Failed to subscribe because: ${error.message}.`);
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
  let subscriberId = req.params.id;
  subscriberParams = getSubscriberParams(req.body);
  Subscriber.findByIdAndUpdate(subscriberId, {
    $set: subscriberParams,
  })
    .then((subscriber) => {
      res.locals.redirect = `/subscribers/${subscriberId}`; // call redirectView afterwards
      res.locals.subscriber = subscriber;
      // success flash message
      req.flash("success", `${subscriber.name} updated successfully!`);
      next();
    })
    .catch((error) => {
      console.log(`Error updating subscriber by ID: ${error.message}`);
      req.flash(
        "error",
        `Failed to update subscriber because: ${error.message}.`
      );
      next(error);
    });
};

const deleteSubscriber = (req, res, next) => {
  let subscriberId = req.params.id;
  Subscriber.findByIdAndDelete(subscriberId)
    .then(() => {
      res.locals.redirect = "/subscribers";
      // success flash message
      req.flash("success", `Unsubscribed successfully!`);
      next();
    })
    .catch((error) => {
      console.log(`Error deleting subscriber by ID: ${error.message}`);
      req.flash("error", `Failed to unsubscribe because: ${error.message}.`);
      next();
    });
};

module.exports = {
  getSubscriberParams,
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
