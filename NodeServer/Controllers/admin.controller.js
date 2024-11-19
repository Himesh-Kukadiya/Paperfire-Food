const getProducts = (req, res) => {
    const productModel = require("../Models/product.model");
    productModel.find().sort({id: 1})
    .then((products) => {
        if(!products) return res.status(404).json({message: 'Products not found'})
        res.status(200).json(products)
    })
    .catch((err) => {
        console.log(err)
        res.status(500).json({message: "error while finding products", error: err})
    })
}

const deleteProduct = (req, res) => {
    const id = req.params.id;
    const productModel = require("../Models/product.model");
    productModel.deleteOne({id})
    .then((products) => {
        if(!products) return res.status(404).json({message: 'Product not found'})
        res.status(200).json({message: "product Deleted successfully"})
    })
    .catch((err) => {
        console.log(err)
        res.status(500).json({message: "error while deleting product", error: err})
    })
}

module.exports = {
    getProducts,
    deleteProduct,
}