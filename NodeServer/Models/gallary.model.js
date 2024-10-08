const mongoose = require('mongoose');

const gallaryModel = mongoose.model('Gallares', {
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
    }
},'Gallares');

module.exports = gallaryModel;