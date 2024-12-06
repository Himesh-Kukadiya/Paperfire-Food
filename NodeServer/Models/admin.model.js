const mongoose = require('mongoose');

const adminModel = mongoose.model("Admins", {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        default: "default.png"
    }
}, "Admins");

module.exports = adminModel;