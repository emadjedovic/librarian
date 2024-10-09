const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
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
    libraries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Library" }],
  },

  // a timestamps property to record createdAt and updatedAt dates
  {
    timestamps: true,
  }
);

// automatically takes care of password storage, so no need for the password property
// instead hash and salt fields
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

// we want first name and last name in one line
// add a virtual attribute
// (computed attribute - isn't saved in the database)
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("User", userSchema);
