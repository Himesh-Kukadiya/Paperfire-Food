const express = require('express');
const router = express.Router();

const servicesController = require("../Controllers/services.controller")
router
    .route("/getServices")
    .get(servicesController.getServices);

const productController = require("../Controllers/products.controller")
router
    .route("/getProducts")
    .get(productController.getProducts);

const galleryController = require("../Controllers/gallary.controller");
router 
    .route("/getGallery")
    .get(galleryController.getGallary);

const testimonialsController = require("../Controllers/testimonials.controller");
router
    .route("/getTestimonials")
    .get(testimonialsController.getTestimonials);


module.exports = router;