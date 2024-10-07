const mongoose = require("mongoose");
const Subscriber = require("./subscriber");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      first: {
        type: String,
        trim: true,
      },
      last: {
        type: String,
        trim: true,
      },
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    zipCode: {
      type: Number,
      min: [1000, "Zip code too short"],
      max: 99999,
    },
    password: {
      type: String,
      required: true,
    },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    subscribedAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscriber",
    },
  },

  // a timestamps property to record createdAt and updatedAt dates
  {
    timestamps: true,
  }
);

// we want first name and last name in one line
// add a virtual attribute
// (computed attribute - isn't saved in the database)
userSchema.virtual("fullName").get(function () {
  return `${this.name.first} ${this.name.last}`;
});

userSchema.pre("save", function (next) {
  let user = this;

  // Check if `subscribedAccount` needs to be connected
  let subscriberPromise = Promise.resolve();
  if (user.subscribedAccount === undefined) {
    subscriberPromise = Subscriber.findOne({ email: user.email })
      .then((subscriber) => {
        user.subscribedAccount = subscriber;
      })
      .catch((error) => {
        console.log(`Error in connecting subscriber: ${error.message}`);
        next(error);
      });
  }

  // Hash the password if it's new or modified
  let passwordPromise = bcrypt
    .hash(user.password, 10)
    .then((hash) => {
      user.password = hash;
    })
    .catch((error) => {
      console.log(`Error in hashing password: ${error.message}`);
      next(error);
    });

  // Wait for both promises to finish before calling `next()`
  Promise.all([subscriberPromise, passwordPromise])
    .then(() => next())
    .catch((error) => next(error));
});

userSchema.methods.passwordComparison = function (inputPassword) {
  let user = this;
  return bcrypt.compare(inputPassword, user.password);
};

module.exports = mongoose.model("User", userSchema);
