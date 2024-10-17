const mongoose = require('mongoose');
const getFormateDate = require('../Functions/getFormateDate');

const paymentModal = mongoose.model('Payments', {
    rId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rents",
        required: true
    },
    amount: {
        type: Number,
        required: true,
    },
    payment_id : {
        type: String,
        required: true,
        unique: true,
    },
    order_id: {
        type: String,
        required: true,
    },
    signature: {
        type: String,
        required: true,
    },
    paymentStatus: {
        type: String,
        required: true,
        default: "pending",
    },
    paymentDate: {
        type: Date,
        required: true,
        default: () => getFormateDate(Date.now),
    },
    paymentMethod: {
        type: String,
        required: true,
        default: "razorpay",
    }
}, 'Payments');

module.exports = paymentModal;