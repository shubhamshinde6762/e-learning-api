const Enrollment = require('../model/enrollment');
const User = require('../model/user');
const Course = require("../model/course");

exports.getCourses = async (req, res) => {
  try {
    const { popularity, level, category, page = 1, limit = 10 } = req.query;

    let filters = {};

    if (popularity) filters.popularity = { $gte: parseInt(popularity) };
    if (level) filters.level = level;
    if (category) filters.category = category;

    const skip = (page - 1) * limit;
    const courses = await Course.find(filters).skip(skip).limit(limit);
    const totalCount = await Course.countDocuments(filters);

    res.status(200).json({ courses, totalCount });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createOrUpdateCourse = async (req, res) => {
  const { title, description, pricings, category, level, popularity } =
    req.body;
    console.log(123)

  const { courseId } = req.params; // If courseId is provided in URL params, it's an update operation
    let course;
  try {

    if (courseId) {
      course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({ message: "Course not found." });
      }

      course.title = title;
      course.description = description;
      course.pricings = pricings;
      course.category = category;
      course.level = level;
      course.popularity = popularity;

      await course.save();
    } else {
      course = new Course({
        title,
        description,
        pricings,
        category,
        level,
        popularity,
      });

      await course.save();
    }

    res.status(200).json({ message: "Course saved successfully.", course });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.deleteCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findOneAndDelete({ _id: courseId });

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    await User.updateMany(
      { enrolledCourses: courseId },
      { $pull: { enrolledCourses: courseId } }
    );

    await Enrollment.deleteMany({ course: courseId });

    res.status(200).json({ message: "Course deleted successfully." });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

