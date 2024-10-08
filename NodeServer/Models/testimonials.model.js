const mongoose = require('mongoose');

const testimonialsModel = mongoose.model('Testimonials', {
    id: {
        type: String,
        require: true,
        uniqu: true
    },
    cName: {
        type: String
    },
    cMessage: {
        type: String
    }
}, 'Testimonials');

module.exports = testimonialsModel;