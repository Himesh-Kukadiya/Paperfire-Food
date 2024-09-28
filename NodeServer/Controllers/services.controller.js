const servicesModel = require("../Models/services.model");

const getServices = (req, res) => { 
    servicesModel.find()
        .then(services => res.status(200).json(services))
        .catch(err => res.status(500).json({message: err.message}));
}

module.exports = {
    getServices
};