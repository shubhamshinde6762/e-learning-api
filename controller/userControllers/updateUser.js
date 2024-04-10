const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const User = require("../../model/user");

exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;

  try {
    let user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (req.files && req.files.file) {
      const fileSize = req.files.file.size;
      if (fileSize > process.env.MAX_FILE_SIZE) {
        return res
          .status(400)
          .json({ message: "File size exceeds the limit." });
      }

      const result = await cloudinary.uploader.upload(
        req.files.file.tempFilePath,
        { resource_type: "auto" }
      );
      user.profile_picture = result.secure_url;
    }

    user.name = name;
    user.email = email;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully.", user });
  } catch (error) {
    console.error(error.message);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation error.", errors });
    }

    res.status(500).json({ message: "Server Error" });
  }
};
