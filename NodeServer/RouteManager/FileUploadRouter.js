const express = require('express');
const router = express.Router();

const userController = require("../Controllers/user.controller")
const fileUploader = require("../Functions/fileUploader");
router
    .route("/profileimage")
    .patch(fileUploader.single('profileImage'), userController.profileImageUpload)

module.exports = router;