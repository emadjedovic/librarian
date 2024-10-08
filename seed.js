const mongoose = require("mongoose");
const Subscriber = require("./models/subscriber");
const Course = require("./models/course");
const User = require("./models/user"); // Include the User model
const passport = require("passport");

const dbURL = "mongodb://localhost:27017/capricciosity";

mongoose
  .connect(dbURL)
  .then(() => {
    console.log("Connected to MongoDB");

    // Clear existing collections
    return Promise.all([
      Subscriber.deleteMany(),
      Course.deleteMany(),
      User.deleteMany(),
    ]);
  })
  .then(() => {
    console.log("Database cleared!");

    // Define subscribers
    const subscribers = [
      { name: "Ema Djedović", email: "ema@gmail.com", zipCode: 71000 },
      { name: "Kenan Konjić", email: "kenan@gmail.com", zipCode: 71000 },
      { name: "Alma Bašić", email: "alma@gmail.com", zipCode: 70230 },
    ];

    // Insert new subscribers
    return Subscriber.insertMany(subscribers);
  })
  .then((subscribers) => {
    console.log("Subscribers added:", subscribers);

    // Now create and link users to subscribers
    const users = [
      {
        name: { first: "Ema", last: "Djedović" },
        email: "ema@gmail.com",
        password: "pass123",
        zipCode: 71000,
      },
      {
        name: { first: "Kenan", last: "Konjić" },
        email: "kenan@gmail.com",
        password: "pass123",
        zipCode: 71000,
      },
      {
        name: { first: "Alma", last: "Bašić" },
        email: "alma@gmail.com",
        password: "pass123",
        zipCode: 70230,
      },
    ];

    // Insert users and link to subscribers
    const userPromises = users.map((userData) => {
      const testUser = new User(userData);

      // Using passport's register method to handle hashing and saving
      return User.register(testUser, userData.password).then((user) => {
        console.log(`User registered: ${user.fullName}`);

        // Find corresponding subscriber by email
        return Subscriber.findOne({ email: user.email })
          .then((subscriber) => {
            if (!subscriber) {
              throw new Error(`Subscriber not found for email: ${user.email}`);
            }

            // Link subscriber to user
            user.subscribedAccount = subscriber._id;

            // Save updated user with subscriber reference
            return user.save();
          })
          .then((updatedUser) => {
            console.log(
              `User updated and linked to subscriber: ${updatedUser.fullName}`
            );
            return updatedUser;
          });
      });
    });

    return Promise.all(userPromises);
  })
  .then((users) => {
    console.log("All users created and linked to subscribers:", users);

    // Create multiple new courses
    return Course.insertMany([
      {
        title: "Tomato Land",
        description: "Locally farmed tomatoes only",
        maxStudents: 30,  // Example value, adjust as needed
        cost: 50,         // Example cost, adjust as needed
      },
      {
        title: "Pizza Masterclass",
        description: "Learn the art of making gourmet pizzas",
        maxStudents: 20,  // Example value, adjust as needed
        cost: 75,         // Example cost, adjust as needed
      },
      {
        title: "Sourdough Bread Basics",
        description: "Master sourdough bread baking techniques",
        maxStudents: 15,  // Example value, adjust as needed
        cost: 40,         // Example cost, adjust as needed
      },
    ]);
    
  })
  .then((courses) => {
    console.log("Courses created:", courses);

    // Find and assign courses to subscribers and users
    const subscriberPromises = [
      Subscriber.findOne({ email: "ema@gmail.com" }).then((subscriber) => {
        subscriber.courses.push(courses[0]._id, courses[1]._id);
        return subscriber.save();
      }),

      Subscriber.findOne({ email: "kenan@gmail.com" }).then((subscriber) => {
        subscriber.courses.push(courses[2]._id);
        return subscriber.save();
      }),
    ];

    const userPromises = [
      User.findOne({ email: "ema@gmail.com" }).then((user) => {
        user.courses.push(courses[0]._id, courses[1]._id);
        console.log(`Assigning courses to user: ${user.fullName}`);
        return user.save();
      }),

      User.findOne({ email: "kenan@gmail.com" }).then((user) => {
        user.courses.push(courses[2]._id);
        console.log(`Assigning courses to user: ${user.fullName}`);
        return user.save();
      }),
    ];

    return Promise.all([...subscriberPromises, ...userPromises]);
  })
  .then(() => {
    console.log("Courses assigned to both subscribers and users.");
  })
  .catch((err) => {
    console.error("Error:", err);
  })
  .finally(() => {
    mongoose.connection.close(); // Ensure connection closes
  });
