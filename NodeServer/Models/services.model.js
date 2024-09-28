const mongoose = require('mongoose');

const serviceModal = mongoose.model('Services', {
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
}, 'Services');

module.exports = serviceModal;