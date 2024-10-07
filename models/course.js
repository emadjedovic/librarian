const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    maxStudents: {
      type: Number,
      default: 0,
      min: [0, "Course cannot have a negative number of students"],
    },
    cost: {
      type: Number,
      default: 0,
      min: [0, "Course cannot have a negative cost"],
    },
  },
  {
    timestamps: true,
  }
  /*
  items: [],
  zipCode: {
    type: Number,
    min: [10000, "Zip code too short"],
    max: 99999,
  },*/
);

module.exports = mongoose.model("Course", courseSchema);
