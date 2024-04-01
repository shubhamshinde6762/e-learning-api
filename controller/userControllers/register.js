const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const User = require("../model/user");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (req.files && req.files.file) {
      const fileSize = req.files.file.size;
      if (fileSize > process.env.MAX_FILE_SIZE) {
        return res
          .status(400)
          .json({ message: "File size exceeds the limit." });
      }
    }

    let url = "";

    const hashedPassword = await bcrypt.hash(password, 10);

    if (req.files && req.files.file) {
      await Promise.all([
        new Promise((resolve, reject) => {
          cloudinary.uploader.upload(
            req.files.file.tempFilePath,
            {
              resource_type: "auto",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result.secure_url);
              }
            }
          );
        })
          .then((url) => {
            url = url;
          })
          .catch((error) => {
            res.status(500).json({ error });
          }),
      ]);
    }

    let user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profile_picture: url,
    });

    await user.save();

    const payload = {
      user: {
        _id: user._id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error.message);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: errors });
    }

    res.status(500).json({ message: "Server Error" });
  }
};
