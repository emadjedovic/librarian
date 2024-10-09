const mongoose = require("mongoose");

const librarySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
      unique: true,
    },
    zipCode: {
      type: Number,
      min: [1000, "Zip code too short"],
      max: 99999,
    },
    contact: {
      phone: String,
      email: String,
      website: String
    },
    openingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String }
    },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
    membershipFee: {
      type: Number,
      default: 0,
      min: [0, "Fee cannot have a negative cost"],
    },
    rulesAndPolicies: {
      type: String,
      default: "Please return books on time and treat library property with care."
    }
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Library", librarySchema);
