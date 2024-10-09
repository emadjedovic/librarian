const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    ISBN: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{13}$/, 'Please provide a valid 13-digit ISBN number'],
    },
    genre: {
      type: String,
      required: true,
      enum: [
        "Fiction",
        "Non-Fiction",
        "Mystery",
        "Science Fiction",
        "Fantasy",
        "Biography",
        "History",
        "Children",
        "Other",
      ],
    },
    publishedDate: {
      type: Date,
      required: true,
    },
    pages: {
      type: Number,
      min: [1, "A book must have at least one page"],
    },
    availableCopies: {
      type: Number,
      default: 1,
      min: [0, "Available copies cannot be less than zero"],
    },
    library: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Library",
      required: true,
    },
    summary: {
      type: String,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", bookSchema);
