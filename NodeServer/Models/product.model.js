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
    quantity : {
        type: Number,
        required: true,
        default: 1
    },
    available : {
        type: Number,
        required: true,
        default: 1
    },
    image: {
        type: Array,
        required: true
    }
}, 'Products')

module.exports = productsModel;