const express = require("express");
const router = express.Router();

const registerUser = require("../controller/registerUser");
const checkEmail = require("../controller/checkEmail")
const checkPassword = require("../controller/checkPassword")
const userDetails = require("../controller/userDetails");
const logout = require("../controller/logout");
const updateUserDetails = require("../controller/updateUserDetails");
const searchUser = require("../controller/searchUser");
const forgotPassword = require("../controller/forgotPassword")

// create user api
router.post('/register',registerUser);
router.post('/email',checkEmail)
router.post('/password',checkPassword)
router.get('/user-details',userDetails)
router.get('/logout',logout)
router.post('/update-user',updateUserDetails)
router.post('/search-user',searchUser)
router.post('/forgot-password',forgotPassword)

module.exports = router;