const mongoose = require('mongoose');

const rentModel = mongoose.model('Rents', {
    pId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    },
    uId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    rent: {
        type: Number,
        required: true
    },
    days: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    mobile: { 
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Pending'
    },
}, 'Rents');

module.exports = rentModel;