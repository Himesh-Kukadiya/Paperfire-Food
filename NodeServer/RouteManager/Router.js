const express = require('express');
const router = express.Router();

const servicesController = require("../Controllers/services.controller")

router
    .route("/getServices")
    .get(servicesController.getServices)

module.exports = router;