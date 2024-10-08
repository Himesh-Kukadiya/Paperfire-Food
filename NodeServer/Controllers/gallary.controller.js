const gallaryModel = require('../Models/gallary.model');

const getGallary = (req, res) => {
    gallaryModel.find()
    .then((gallary) => res.status(200).json(gallary))
    .catch((error) => res.status(500).json({message: "Error while fetching gallary : ", error}));
}

module.exports = {
    getGallary
}