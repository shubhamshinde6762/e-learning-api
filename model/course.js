const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required."],
    unique: [true, "Title must be unique."],
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters."],
  },

  description: {
    type: String,
    required: [true, "Description is required."],
    maxlength: [1000, "Description cannot exceed 1000 characters."],
  },

  pricings: {
    type: Number,
    required: [true, "Pricing is required."],
    min: [0, "Pricing cannot be negative."],
  },

  category: {
    type: String,
    required: [true, "Category is required."],
  },

  level: {
    type: String,
    required: [true, "Level is required."],
    enum: {
      values: ["Beginner", "Intermediate", "Advanced"],
      message: "Invalid level.",
    },
  },

  popularity: {
    type: Number,
    required: [true, "Popularity is required."],
    min: [0, "Popularity cannot be negative."],
    max: [5, "Popularity cannot be greater than 5."],
  },

  usersEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
});

module.exports = mongoose.model("Course", courseSchema);
