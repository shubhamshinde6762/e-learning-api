const express = require("express");
const router = express.Router();
const { superadminAuthMiddleware } = require("../middlewares/isSuperAdmin.js");

const {
  createOrUpdateCourse,
  deleteCourse,
} = require("../controller/courseController");

router.put("/courses/:id?", superadminAuthMiddleware, createOrUpdateCourse);
router.delete("/courses/:id", superadminAuthMiddleware, deleteCourse);

module.exports = router;
