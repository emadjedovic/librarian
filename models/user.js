const mongoose = require("mongoose");
const { Schema } = mongoose;
const Subscriber = require("./subscriber");

const userSchema = new Schema(
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
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    subscribedAccount: { type: Schema.Types.ObjectId, ref: "Subscriber" },
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
  // a quick conditional check for existing subscriber connections
  if (user.subscribedAccount === undefined) {
    // Query for a single subscriber
    Subscriber.findOne({
      email: user.email,
    })
      .then((subscriber) => {
        // Connect the user with a subscriber account
        user.subscribedAccount = subscriber;
        next();
      })
      .catch((error) => {
        console.log(`Error in connecting subscriber: ${error.message}`);
        next(error);
      });
  } else {
    // Call next function if user already has an association
    next();
  }
});

module.exports = mongoose.model("User", userSchema);