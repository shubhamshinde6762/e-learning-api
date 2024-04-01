const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
  },

  email: {
    type: String,
    required: [true, "Email is required."],
    unique: [true, "Email must be unique."],
    lowercase: true,
    validate: {
      validator: function (value) {
        return /^\S+@\S+\.\S+$/.test(value);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },

  profile_picture: {
    type: String,
    required: [true, "Profile picture URL is required."],
    validate: {
      validator: function (value) {
        return /^(ftp|http|https):\/\/[^ "]+$/.test(value);
      },
      message: (props) =>
        `${props.value} is not a valid URL for profile picture!`,
    },
  },

  password: {
    type: String,
    required: [true, "Password is required."],
  },

  role: {
    type: String,
    required: [true, "Role is required."],
    enum: {
      values: ["user", "superadmin"],
      message: "Invalid role.",
    },
  },

  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Enrolled courses are required."],
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
