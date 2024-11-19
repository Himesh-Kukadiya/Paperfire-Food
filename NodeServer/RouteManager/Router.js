const express = require('express');
const router = express.Router();

const userController = require('../Controllers/user.controller');
router
    .route("/userRegistration")
    .post(userController.userRegistration)

router
    .route("/userLogin")
    .post(userController.userLogin)

router
    .route("/updateProfile")
    .post(userController.updateProfile)

router 
    .route("/sendOTP")
    .post(userController.sendOTP)

router
    .route("/verifyOTP")
    .post(userController.verifyOTP);

router
    .route("/changePassword")
    .post(userController.changePassword);

router 
    .route("/logOtps")
    .get(userController.logOtps);

const servicesController = require("../Controllers/services.controller")
router
    .route("/getServices")
    .get(servicesController.getServices);

const productController = require("../Controllers/products.controller")
router
    .route("/getProducts")
    .get(productController.getProducts);

router 
    .route("/getProductDetails/:P_ID")
    .get(productController.getProductDetails);

const paymentController = require("../Controllers/payment.controller");
router 
    .route("/getOptions")
    .post(paymentController.getOptions)

router
    .route("/paymentVerification/:userId")
    .post(paymentController.paymentVerification);

const galleryController = require("../Controllers/gallary.controller");
router 
    .route("/getGallery")
    .get(galleryController.getGallary);

const testimonialsController = require("../Controllers/testimonials.controller");
router
    .route("/getTestimonials")
    .get(testimonialsController.getTestimonials);

const rentController = require("../Controllers/rents.controller");
router
    .route("/getRents/:userId")
    .get(rentController.getRents)

const adminController = require("../Controllers/admin.controller");
router 
    .route("/admin/getProducts")
    .get(adminController.getProducts)

router 
    .route("/admin/deleteProduct/:id")
    .delete(adminController.deleteProduct)

module.exports = router;