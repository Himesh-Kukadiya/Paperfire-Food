const productsModal = require("../Models/product.model")

const getProducts = (req, res) => {
    productsModal.find()
    .then(products => res.status(200).json(products))
    .catch(error => res.status(500).json({message: "Error fetching products", error}))
}

module.exports = {
    getProducts,
}