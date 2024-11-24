const express = require('express');
const router = express.Router();

const userController = require("../Controllers/user.controller")
const adminController = require("../Controllers/admin.controller");

const fileUploader = require("../Functions/fileUploader");
router
    .route("/profileimage")
    .patch(fileUploader("Public/Images/Users").single('profileImage'), userController.profileImageUpload)

router
    .route("/admin/editProductImage")
    .patch(fileUploader("Public/Images/Products").single('productImage'), adminController.editProductImage)

router
    .route("/admin/deleteProductImage/:_id")
    .put(adminController.deleteProductImage)

router
    .route("/admin/addImage")
    .patch(fileUploader("Public/Images/Products").single('productImage'), adminController.addImage)

module.exports = router;