const express = require('express');
const router = express.Router();

const homeController = require("../Controllers/page.controller")
router 
    .route("/")
    .get(homeController.home)
router 
    .route("/about")
    .get(homeController.about)
router
    .route("/contact")
    .get(homeController.contact)

module.exports = router;