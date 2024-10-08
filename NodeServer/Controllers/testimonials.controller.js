const testimonialsModel = require("../Models/testimonials.model");

const getTestimonials = (req, res) => {
    testimonialsModel.find()
    .then((testimonials) => res.status(200).json(testimonials))
    .catch((error) => res.status(500).json({message: "Error while fetching testimonials : ", error}))
}

module.exports = {
    getTestimonials
}