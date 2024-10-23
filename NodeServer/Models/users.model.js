const mongoose = require('mongoose');

const usersModel = mongoose.model('Users', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
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
    restaurant: {
        type: String,
    },
    rAddress: {
        type: String,
    },
    imageURL: {
        type: String,
        default: 'default.png'
    }
}, 'Users');

module.exports = usersModel;