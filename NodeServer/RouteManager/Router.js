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
    .route("/paymentVarification/:P_ID")
    .post(paymentController.paymentVarification);

const galleryController = require("../Controllers/gallary.controller");
router 
    .route("/getGallery")
    .get(galleryController.getGallary);

const testimonialsController = require("../Controllers/testimonials.controller");
router
    .route("/getTestimonials")
    .get(testimonialsController.getTestimonials);

module.exports = router;