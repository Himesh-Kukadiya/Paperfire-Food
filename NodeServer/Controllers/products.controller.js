const productsModal = require("../Models/product.model")
const rentModal = require("../Models/rent.model");

const getFormateDate = require("../Functions/getFormateDate");

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
        rentModal.find({pId: product.id, toDate: { $gte: new Date(getFormateDate(new Date())) }}) // finding rent details
        .then((rent) => {
            if(!rent || rent.length === 0) return res.status(200).json({product}); // if rent is empty then send only product details
            const rents = []; 
            rent.forEach((r) => {
                const newRent = {};
                for(let i = 0; i < r.pId.length; i++) {
                    if(String(r.pId[i]) === p_id) rents.push({fromDate: getFormateDate(r.fromDate[i]),toDate: getFormateDate(r.toDate[i]),quantity: r.quantity[i]}); 
                }
            })
            res.status(200).json({product, rent: rents}); // if rent is not empty then send product details with rent details.
        })
        .catch((error) => {
            console.log(error); 
            res.status(500).json({message: "Error fetching rent details", error})
        })
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({message: "Error fetching product details", error})
    })
};


module.exports = {
    getProducts,
    getProductDetails,
}