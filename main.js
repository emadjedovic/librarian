const express = require("express");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const User = require("./models/user");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const connectFlash = require("connect-flash");
const passport = require("passport");

const coursesController = require("./controllers/coursesController");
const errorController = require("./controllers/errorController");
const homeController = require("./controllers/homeController");
const subscribersController = require("./controllers/subscribersController");
const usersController = require("./controllers/usersController");

const dbURL = "mongodb://localhost:27017/capricciosity";

mongoose
  .connect(dbURL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const app = express();

// MIDDLEWARE

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Layout middleware
app.use(layouts);

// Body parsing middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override to handle PUT/DELETE in forms
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

// Cookie parser middleware
app.use(cookieParser("secret_passcode"));

// Session middleware
app.use(
  expressSession({
    secret: "secret_passcode",
    cookie: {
      maxAge: 4000000,
    },
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());
// Passport authentication strategies
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash message middleware
app.use(connectFlash());

// Make flash messages, user authentication status, and current user available globally in views
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

app.get("/", homeController.showHome);
app.get("/thanks", (req, res) => {
  res.render("thanks");
});

// COURSES

app.get("/courses", coursesController.index, coursesController.indexView);
app.get("/courses/new", coursesController.newCourse);
app.post(
  "/courses/create",
  coursesController.createCourse,
  coursesController.redirectView
);
app.get(
  "/courses/:id",
  coursesController.showCourse,
  coursesController.showView
);
app.get("/courses/:id/edit", coursesController.showEdit);
app.put(
  "/courses/:id/update",
  coursesController.updateCourse,
  coursesController.redirectView
);
app.delete(
  "/courses/:id/delete",
  coursesController.deleteCourse,
  coursesController.redirectView
);

// USERS

// When usersController.index completes your query and adds your data
// to the res object, indexView is called to render the view.
app.get("/users", usersController.index, usersController.indexView);
app.get("/users/new", usersController.newUser);
// determine whether data meets the requirements to continue to the create action
app.post(
  "/users/create", usersController.validate,
  usersController.createUser,
  usersController.redirectView
);

app.get("/users/login", usersController.login);
app.post("/users/login", usersController.authenticate);
app.get("/users/logout", usersController.logout, usersController.redirectView)

app.get("/users/:id", usersController.showUser, usersController.showView);
app.get("/users/:id/edit", usersController.showEdit);
// Process data from the edit form, and display the user show page.
app.put(
  "/users/:id/update",
  usersController.updateUser,
  usersController.redirectView
);
app.delete(
  "/users/:id/delete",
  usersController.deleteUser,
  usersController.redirectView
);

// SUBSCRIBERS

app.get(
  "/subscribers",
  subscribersController.index,
  subscribersController.indexView
);
app.get("/subscribers/new", subscribersController.newSubscriber);
app.post(
  "/subscribers/create",
  subscribersController.createSubscriber,
  subscribersController.redirectView
);
app.get(
  "/subscribers/:id",
  subscribersController.showSubscriber,
  subscribersController.showView
);
app.get("/subscribers/:id/edit", subscribersController.showEdit);
// Process data from the edit form, and display the subscriber show page.
app.put(
  "/subscribers/:id/update",
  subscribersController.updateSubscriber,
  subscribersController.redirectView
);
app.delete(
  "/subscribers/:id/delete",
  subscribersController.deleteSubscriber,
  subscribersController.redirectView
);

// ERROR HANDLING

app.use(errorController.internalServerError);
app.use(errorController.pageNotFoundError);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
