const Enrollment = require("../models/enrollment");
const User = require("../models/user");
const Course = require("../models/course");

exports.enrollUser = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });

    if (existingEnrollment) {
      return res
        .status(400)
        .json({ message: "User is already enrolled in the course." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    const enrollment = new Enrollment({ user: userId, course: courseId });
    await enrollment.save();

    res
      .status(200)
      .json({ message: "User enrolled successfully.", enrollment });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.params.user_id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const enrollments = await Enrollment.find({ user: userId }).populate(
      "course"
    );

    res.status(200).json({ enrollments });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
