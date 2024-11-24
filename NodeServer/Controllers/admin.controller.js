const fs = require("fs");
const path = require("path");

const productModel = require("../Models/product.model");

const getProducts = (req, res) => {
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

const updateProduct = (req, res) => {
    const _id = req.params.id;
    const product = req.body;
    productModel.findByIdAndUpdate(_id, product, {new: true})
    .then((productData) => {
        if(!productData) return res.status(404).json({message: 'Product not found'})
        res.status(200).json({message: "product updated successfully", productData});
    })
    .catch((err) => {
        console.log(err)
        res.status(500).json({message: "error while updating product", error: err});
    });
}

const deleteProduct = (req, res) => {
    const id = req.params.id;
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

const editProductImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const { filename } = req.file;
        const { _id, index } = req.body;

        if (!_id || index === undefined) {
            return res.status(400).json({ message: "Product ID and image index are required" });
        }

        const product = await productModel.findById(_id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const imageIndex = Number(index);
        if (imageIndex < 0 ) {
            return res.status(400).json({ message: "Invalid image index" });
        }
        else if(imageIndex >= product.image.length) {
            product.image.push(filename)

        }
        else {
            const imagePath = path.join(__dirname, "../Public/Images/Products/", product.image[imageIndex]);
            fs.unlinkSync(imagePath);
            product.image[imageIndex] = filename;
        }

        const updatedProduct = await productModel.findByIdAndUpdate(_id, { image: product.image }, { new: true });

            if (!updatedProduct) {
                return res.status(404).json({ message: "Failed to update product image" });
            }

            res.status(200).json({ message: "Product image updated successfully", product: updatedProduct });
    } catch (err) {
        console.error("Error updating product image:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

const deleteProductImage = async (req, res) => {
    try {
        const _id = req.params._id;
        const { product, removed } = req.body;

        if (!_id || !product || removed === undefined) {
            return res.status(400).json({ message: "Product ID and updated product data are required" });
        }

        // Update the product in the database
        const updatedProduct = await productModel.findByIdAndUpdate(_id, { image: product.image }, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        else {

            // delete image file
            const imagePath = path.join(__dirname, "../Public/Images/Products/", removed);
            fs.unlinkSync(imagePath);


            res.status(200).json({ message: "Product image deleted successfully", product: updatedProduct });
        }
    }
    catch (err) {
        console.error("Error deleting product image:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

// add product image and edit product image
const addImage = (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const {images, index} = req.body;

        console.log(index)
        let imgArr = [];

        if(images.length > 0)
            imgArr = images.split(",")

        const { filename } = req.file;
        if(index < 0)
            imgArr.push(filename);
        else {
        const imagePath = path.join(__dirname, "../Public/Images/Products/", imgArr[index]);
        fs.unlinkSync(imagePath);
        imgArr[index] = filename;

        }
        res.status(200).json({message: "Product image added successfully", images: imgArr});
    }
    catch(error) {
        console.log("Error while adding Image", error)
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}


const deleteNewProductImage = (req, res) => {
    try {
        const {images, index} = req.body;

        if(index < 0 || index >= images.length)
            return res.status(400).json({ message: "Invalid image index" });

        const unlinkImg = images.splice(index, 1);

        const imagePath = path.join(__dirname, "../Public/Images/Products/", unlinkImg[0]);
        fs.unlinkSync(imagePath);

        res.status(200).json({message: "image deleted successfully!", images});
    }
    catch(error) {
        console.log("Error while deleting New Image", error)
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const addProduct = (req, res) => {
    const {product} = req.body;
    productModel.create(product)
    .then((newProduct) => {
        if(!newProduct) return res.status(404).json({ message: "product addition failed"});
        productModel.find()
        .then((products) => {
            if(!products) return res.status(404).json({ message: "no any products found"});
            
            res.status(200).json({ message: "product added successfully", products: products});
        })
        .catch((err) => {
            console.log("Error while finding product:", err)
            res.status(500).json({ message: "Error while finding product", err})
        })
    })
    .catch((err) => {
        console.log("Error while adding product:", err)
        res.status(500).json({ message: "Error while adding product", err})
    })
}

module.exports = {
    getProducts,
    updateProduct,
    deleteProduct,
    editProductImage,
    deleteProductImage,
    addImage,
    deleteNewProductImage,
    addProduct,
}