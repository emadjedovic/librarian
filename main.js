const express = require("express");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const course = require("./models/course");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const connectFlash = require("connect-flash");

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

app.use(express.static("public"));
app.use(layouts);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//app.use(expressValidator())
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);
app.use(cookieParser("secret_passcode"));
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
app.use(connectFlash());
// Assign flash messages to the local flashMessages variable on the response object.
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
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
app.post("/users/login", usersController.authenticate, usersController.redirectView);

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
