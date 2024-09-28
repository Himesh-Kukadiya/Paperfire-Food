const express = require('express');
const router = express.Router();

const servicesController = require("../Controllers/services.controller")

router
    .route("/getServices")
    .get(servicesController.getServices)

const productController = require("../Controllers/products.controller")
router
    .route("/getProducts")
    .get(productController.getProducts)

module.exports = router;