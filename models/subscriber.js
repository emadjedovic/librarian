const mongoose = require("mongoose");

const subscriberSchema = mongoose.Schema({
  // properties
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  zipCode: {
    type: Number,
    min: [10000, "Zip code too short"],
    max: 99999,
  },
  // stores a reference to each associated course by that course’s ObjectId
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

const Subscriber = mongoose.model("Subscriber", subscriberSchema);

// an instance method to get the full name of a subscriber
subscriberSchema.methods.getInfo = function () {
  return `Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode}`;
};

// find subscribers with the same zip
subscriberSchema.methods.findLocalSubscribers = function () {
  return this.model("Subscriber").find({ zipCode: this.zipCode }).exec();
};

module.exports = Subscriber;
