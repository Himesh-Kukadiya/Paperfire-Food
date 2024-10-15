const productsModal = require("../Models/product.model")

const getFormateDate = (today) => {
    return today.toISOString().split('T')[0];
}

const getProducts = (req, res) => {
    productsModal.find()
    .then(products => res.status(200).json(products))
    .catch(error => res.status(500).json({message: "Error fetching products", error}))
}

const getProductDetails = (req, res) => {
    const p_id = req.params.P_ID; // id from req url.
    productsModal.findOne({id: p_id}) // finding product details
    .then((product) => {
        if (!product) return res.status(404).json({message: "Product not found"});
        rentModal.find({pId: product._id, toDate: { $gte: new Date(getFormateDate(new Date())) }}) // finding rent details
        .then((rent) => {
            if(!rent || rent.length === 0) return res.status(200).json({product}); // if rent is empty then send only product details
            const newRent = []; 
            rent.forEach((r) => {
                newRent.push({fromDate: getFormateDate(r.fromDate),toDate: getFormateDate(r.toDate),quantity: r.quantity}); // we need only fromDate, toDate and quantity
            })
            res.status(200).json({product, rent: newRent}); // if rent is not empty then send product details with rent details.
        })
        .catch((error) => res.status(500).json({message: "Error fetching rent details", error}))})
    .catch((error) => res.status(500).json({message: "Error fetching product details", error}))
};


module.exports = {
    getProducts,
    getProductDetails,
}