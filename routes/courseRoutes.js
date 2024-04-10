const express = require("express");
const router = express.Router();

const { getCourses } = require("../controller/courseController");
const { enrollUser,  getEnrolledCourses} = require("../controller/enrollmentController");
const {userAuthMiddleware} = require("../middlewares/isUser")


router.get("/courses", getCourses);
router.post("/enrollments",userAuthMiddleware,  enrollUser);
router.get("/enrollments/:user_id?",userAuthMiddleware, getEnrolledCourses);

module.exports = router;
