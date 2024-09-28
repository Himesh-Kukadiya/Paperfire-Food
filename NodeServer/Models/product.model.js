const mongoose = require('mongoose');

const productsModel = mongoose.model('Products', {
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    des: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    rant: {
        type: Number,
        required: true
    },
    time: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    }
}, 'Products')

module.exports = productsModel;