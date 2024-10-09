const mongoose = require("mongoose");
const Library = require("./models/library");
const User = require("./models/user");
const Book = require("./models/book");
const passport = require("passport");

const dbURL = "mongodb://localhost:27017/librarian";

mongoose
  .connect(dbURL)
  .then(() => {
    console.log("Connected to MongoDB");

    // Clear existing collections
    return Promise.all([
      Library.deleteMany(),
      User.deleteMany(),
      Book.deleteMany(),
    ]);
  })
  .then(() => {
    console.log("Database cleared!");

    // Create libraries first
    return Library.insertMany([
      {
        name: "Central Library",
        address: "123 Main St",
        zipCode: 71000,
        contact: {
          phone: "123-456-7890",
          email: "central@library.com",
          website: "www.centrallibrary.com",
        },
        openingHours: {
          monday: { open: "09:00", close: "17:00" },
          tuesday: { open: "09:00", close: "17:00" },
          wednesday: { open: "09:00", close: "17:00" },
          thursday: { open: "09:00", close: "19:00" },
          friday: { open: "09:00", close: "17:00" },
          saturday: { open: "10:00", close: "14:00" },
          sunday: { open: "Closed", close: "Closed" },
        },
      },
      {
        name: "Westside Library",
        address: "456 Westside Ave",
        zipCode: 71001,
        contact: {
          phone: "987-654-3210",
          email: "westside@library.com",
          website: "www.westside.com",
        },
        openingHours: {
          monday: { open: "10:00", close: "18:00" },
          tuesday: { open: "10:00", close: "18:00" },
          wednesday: { open: "10:00", close: "18:00" },
          thursday: { open: "10:00", close: "20:00" },
          friday: { open: "10:00", close: "18:00" },
          saturday: { open: "11:00", close: "15:00" },
          sunday: { open: "Closed", close: "Closed" },
        },
      },
    ]);
  })
  .then((libraries) => {

    // Create books for the libraries
    const bookData = [
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        ISBN: "9780061120084",
        genre: "Fiction",
        publishedDate: new Date("1960-07-11"),
        pages: 281,
        availableCopies: 5,
        library: libraries[0]._id, // First library
        summary: "A novel about the serious issues of rape and racial inequality.",
      },
      {
        title: "1984",
        author: "George Orwell",
        ISBN: "9780451524935",
        genre: "Science Fiction",
        publishedDate: new Date("1949-06-08"),
        pages: 328,
        availableCopies: 3,
        library: libraries[0]._id, // First library
        summary: "A dystopian novel set in a totalitarian society ruled by Big Brother.",
      },
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        ISBN: "9780743273565",
        genre: "Fiction",
        publishedDate: new Date("1925-04-10"),
        pages: 180,
        availableCopies: 4,
        library: libraries[1]._id, // Second library
        summary: "A story about the young and mysterious millionaire Jay Gatsby.",
      },
    ];

    // Create books and then update the libraries with the created books
    const bookPromises = bookData.map((book) =>
      Book.create(book).then((createdBook) => {
        console.log(`Book created: ${createdBook.title}`);

        // Update the library with the new book
        return Library.findByIdAndUpdate(
          createdBook.library, // The library ID from the book
          { $push: { books: createdBook._id } }, // Add the book ID to the library's books array
          { new: true } // Return the updated library document
        ).then((updatedLibrary) => {
          console.log(`Updated library: ${updatedLibrary.name} with book ${createdBook.title}`);
        });
      })
    );

    return Promise.all(bookPromises).then(() => libraries); // Return libraries for further steps
  })
  .then((libraries) => {
    // Now create users
    const users = [
      {
        firstName: "Ema",
        lastName: "Djedović",
        email: "ema@gmail.com",
        password: "pass123",
        zipCode: 71000,
      },
      {
        firstName: "Kenan",
        lastName: "Konjić",
        email: "kenan@gmail.com",
        password: "pass123",
        zipCode: 71000,
      },
      {
        firstName: "Alma",
        lastName: "Bašić",
        email: "alma@gmail.com",
        password: "pass123",
        zipCode: 70230,
      },
    ];

    const userPromises = users.map((userData) => {
      const testUser = new User(userData);
      return User.register(testUser, userData.password).then((user) => {
        console.log(`User registered: ${user.fullName}`);
        return user; // Return user for further processing
      });
    });

    return Promise.all(userPromises).then((registeredUsers) => {
      return { registeredUsers, libraries };
    });
  })
  .then(({ registeredUsers, libraries }) => {
    // Assign libraries to users
    const userPromises = [
      User.findOne({ email: "ema@gmail.com" }).then((user) => {
        if (user) {
          user.libraries.push(libraries[0]._id, libraries[1]._id); // Assign both libraries
          console.log(`Adding membership: ${user.fullName}`);
          return user.save();
        }
      }),
      User.findOne({ email: "kenan@gmail.com" }).then((user) => {
        if (user) {
          user.libraries.push(libraries[0]._id); // Assign the first library
          console.log(`Adding membership: ${user.fullName}`);
          return user.save();
        }
      }),
      User.findOne({ email: "alma@gmail.com" }).then((user) => {
        if (user) {
          user.libraries.push(libraries[1]._id); // Assign the second library
          console.log(`Adding membership: ${user.fullName}`);
          return user.save();
        }
      }),
    ];

    return Promise.all(userPromises);
  })
  .then(() => {
    console.log("Libraries assigned to users.");
  })
  .catch((err) => {
    console.error("Error:", err);
  })
  .finally(() => {
    mongoose.connection.close();
  });
