const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const User = require("../../model/user");
const Resend = require("resend").Resend;
require("dotenv").config();
const resend = new Resend(process.env.RESEND_KEY);

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

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .json({
          message:
            "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit.",
        });
    }
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
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      profile_picture: url,
    });

    console.log(123);

    const payload = {
      user: {
        _id: user._id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });

    resend.emails
      .send({
        from: "Acme <onboarding@resend.dev>",
        to: [email],
        subject: "Thank You for Registering",
        html: `<div style="background-color: #f4f4f4; padding: 20px;">
                <h2 style="color: #333333;">Thank You for Registering!</h2>
                <p style="color: #333333;">We're delighted to have you join our community. Your registration was successful.</p>
                <p style="color: #333333;">You can now access our platform and explore a wide range of courses to enhance your skills and knowledge.</p>
                <p style="color: #333333;">If you have any questions or need assistance, feel free to contact us.</p>
                <p style="color: #333333;">Happy learning!</p>
            </div>`,
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.error(error.message);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: errors });
    }

    res.status(500).json({ message: "Server Error" });
  }
};
