const mongoose = require("mongoose");
const Library = require("./models/library");
const Member = require("./models/member");
const passport = require("passport");

const dbURL = "mongodb://localhost:27017/librarian";

mongoose
  .connect(dbURL)
  .then(() => {
    console.log("Connected to MongoDB");

    // Clear existing collections
    return Promise.all([
      Library.deleteMany(),
      Member.deleteMany(),
    ]);
  })
  .then(() => {
    console.log("Database cleared!");

    const members = [
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

    const memberPromises = members.map((memberData) => {
      const testMember = new Member(memberData);

      // Using passport's register method to handle hashing and saving
      return Member.register(testMember, memberData.password).then((member) => {
        console.log(`Member registered: ${member.fullName}`);

        
          
      });
    });

    return Promise.all(memberPromises);
  })
  .then((members) => {

    // Create multiple new libraries
    return Library.insertMany([
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
  .then((libraries) => {
    console.log("Libraries created:", libraries);


    const memberPromises = [
      Member.findOne({ email: "ema@gmail.com" }).then((member) => {
        member.libraries.push(libraries[0]._id, libraries[1]._id);
        console.log(`Assigning libraries to member: ${member.fullName}`);
        return member.save();
      }),

      Member.findOne({ email: "kenan@gmail.com" }).then((member) => {
        member.libraries.push(libraries[2]._id);
        console.log(`Assigning libraries to member: ${member.fullName}`);
        return member.save();
      }),
    ];

    return Promise.all([...memberPromises]);
  })
  .then(() => {
    console.log("Libraries assigned to members.");
  })
  .catch((err) => {
    console.error("Error:", err);
  })
  .finally(() => {
    mongoose.connection.close();
  });
