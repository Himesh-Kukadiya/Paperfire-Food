const fs = require("fs");
const path = require("path");

const sendMail = require("../Functions/sendMail");

const productModel = require("../Models/product.model");
const rentsModel = require("../Models/rent.model");
const productsModel = require("../Models/product.model");
const getFormateDate = require("../Functions/getFormateDate");
const usersModel = require("../Models/users.model");
const paymentModel = require("../Models/payment.model")

const getProducts = (req, res) => {
    productModel.find().sort({ id: 1 })
        .then((products) => {
            if (!products) return res.status(404).json({ message: 'Products not found' })
            res.status(200).json(products)
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({ message: "error while finding products", error: err })
        })
}

const updateProduct = (req, res) => {
    const _id = req.params.id;
    const product = req.body;
    productModel.findByIdAndUpdate(_id, product, { new: true })
        .then((productData) => {
            if (!productData) return res.status(404).json({ message: 'Product not found' })
            res.status(200).json({ message: "product updated successfully", productData });
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({ message: "error while updating product", error: err });
        });
}

const deleteProduct = (req, res) => {
    const id = req.params.id;
    productModel.deleteOne({ id })
        .then((products) => {
            if (!products) return res.status(404).json({ message: 'Product not found' })
            res.status(200).json({ message: "product Deleted successfully" })
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({ message: "error while deleting product", error: err })
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
        if (imageIndex < 0) {
            return res.status(400).json({ message: "Invalid image index" });
        }
        else if (imageIndex >= product.image.length) {
            product.image.push(filename)

        }
        else {
            if (!product.image[imageIndex] === "") {
                const imagePath = path.join(__dirname, "../Public/Images/Products/", product.image[imageIndex]);
                fs.unlinkSync(imagePath);
            }
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

        const { images, index } = req.body;

        console.log(index)
        let imgArr = [];

        if (images.length > 0)
            imgArr = images.split(",")

        const { filename } = req.file;
        if (index < 0)
            imgArr.push(filename);
        else {
            const imagePath = path.join(__dirname, "../Public/Images/Products/", imgArr[index]);
            fs.unlinkSync(imagePath);
            imgArr[index] = filename;

        }
        res.status(200).json({ message: "Product image added successfully", images: imgArr });
    }
    catch (error) {
        console.log("Error while adding Image", error)
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}


const deleteNewProductImage = (req, res) => {
    try {
        const { images, index } = req.body;

        if (index < 0 || index >= images.length)
            return res.status(400).json({ message: "Invalid image index" });

        const unlinkImg = images.splice(index, 1);

        const imagePath = path.join(__dirname, "../Public/Images/Products/", unlinkImg[0]);
        fs.unlinkSync(imagePath);

        res.status(200).json({ message: "image deleted successfully!", images });
    }
    catch (error) {
        console.log("Error while deleting New Image", error)
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const addProduct = (req, res) => {
    const { product } = req.body;
    productModel.create(product)
        .then((newProduct) => {
            if (!newProduct) return res.status(404).json({ message: "product addition failed" });
            productModel.find()
                .then((products) => {
                    if (!products) return res.status(404).json({ message: "no any products found" });

                    res.status(200).json({ message: "product added successfully", products: products });
                })
                .catch((err) => {
                    console.log("Error while finding product:", err)
                    res.status(500).json({ message: "Error while finding product", err })
                })
        })
        .catch((err) => {
            console.log("Error while adding product:", err)
            res.status(500).json({ message: "Error while adding product", err })
        })
}

const getRents = async (req, res) => {
    try {
        const rents = await rentsModel.find(); // Fetch all rents

        if (!rents || rents.length === 0) {
            return res.status(404).json({ message: "No orders have been placed yet." });
        }

        const rentsData = await Promise.all(
            rents.map(async (rent) => {
                let gTotalCnt = 0;
                const products = await Promise.all(
                    rent.pId.map(async (pId, index) => {
                        const product = await productsModel.find({ id: pId });
                        console.log();
                        gTotalCnt += rent.total[index];
                        return {
                            id: pId,
                            name: product[0]?.name || "unknown",
                            img: `http://localhost:7575/Images/Products/${product[0].image[0]}`,
                            quantity: rent.quantity[index],
                            fromDate: getFormateDate(rent.fromDate[index]),
                            toDate: getFormateDate(rent.toDate[index]),
                            rent: rent.rent[index],
                            time: product[0]?.time || " / day",
                            total: rent.total[index],
                        };
                    })
                );

                return {
                    id: rent._id,
                    uId: rent.uId,
                    products,
                    GTotal: gTotalCnt,
                    mobile: rent.mobile,
                    address: rent.address,
                    city: rent.city,
                    state: rent.state,
                    zip: rent.zip,
                    status: rent.status,
                };
            })
        );

        res.status(200).json(rentsData);
    } catch (err) {
        console.error("Error while fetching rents:", err);
        res.status(500).json({ message: "Error while fetching rents", error: err.message });
    }
};

const updateStatus = (req, res) => {
    const { id, uId, status } = req.body;

    rentsModel.findByIdAndUpdate(id, { status }, { new: true })
        .then((rent) => {
            if (!rent) return res.status(404).json({ message: "Error while updating status" });

            usersModel.findById(uId, "name email")
                .then((user) => {
                    paymentModel.findOne({ rId: id }, "_id")
                        .then((payment) => {
                            if (!payment) return res.status(404).json({ message: "Payment not found" });

                            let subject = "";
                            let message = `Dear ${user.name},`;

                            if (status === "Accepted") {
                                subject = "Your Order has been Accepted!";
                                message += `\n\nYour order with ID: ${rent.id} has been accepted. We are processing your order and will notify you once it is ready.\n\nThank you for choosing us!`;
                            } else if (status === "Rejected") {
                                subject = "Your Order has been Rejected!";
                                message += `\n\nUnfortunately, your order with ID: ${rent.id} has been rejected. Your payment with ID: ${payment._id} is refended in upcomming 4 days. Please contact us if you have any questions.\n\nThank you for your understanding.`;
                            } else if (status === "Pending") {
                                subject = "Your Order Status is Pending";
                                message += `\n\nYour order with ID: ${rent.id} is currently pending. We will notify you as soon as there is an update on your order.\n\nThank you for your patience.`;
                            }

                            message += `\n\nIf you have any queries, please reach out to us at: paperfirefood075@gmail.com. We will be happy to assist you.\n\nBest regards,\nYour PaperFire Team`;

                            // Call the sendMail function to send the email
                            sendMail(subject, message, "", user.email)
                            res.status(200).json({ message: `Status updated to ${status} and email sent to user.` });
                        })
                        .catch((error) => {
                            console.error("Error while finding payment:", error);
                            res.status(500).json({ message: "Error while finding payment", error: error.message });
                        })
                })
                .catch((err) => {
                    console.error("Error while finding user:", err);
                    res.status(500).json({ message: "Error while finding user", error: err.message });
                });
        })
        .catch(err => {
            console.error("Error while updating status:", err);
            res.status(500).json({ message: "Error while updating status", error: err.message });
        });
};



module.exports = {
    getProducts,
    updateProduct,
    deleteProduct,
    editProductImage,
    deleteProductImage,
    addImage,
    deleteNewProductImage,
    addProduct,
    getRents,
    updateStatus,
}