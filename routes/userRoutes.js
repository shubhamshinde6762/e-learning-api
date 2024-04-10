const express = require('express');
const router = express.Router();

const {getProfile} = require("../controller/userControllers/fetchUser.js")
const {registerUser} = require("../controller/userControllers/register.js")
const {updateProfile} = require("../controller/userControllers/updateUser.js")

router.post('/users/register', registerUser);
router.get('/users/profile', getProfile);
router.put('/users/profile', updateProfile);

module.exports = router;