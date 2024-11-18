const rentModal = require("../Models/rent.model")
const productModal = require("../Models/product.model");
const getFormateDate = require("../Functions/getFormateDate")

const getRents = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find rents associated with the user
        const rents = await rentModal.find({ uId: userId });
        if (!rents || rents.length === 0) {
            return res.status(404).json({ message: 'No rents found for this user' });
        }

        // Process each rent asynchronously
        const results = await Promise.all(
            rents.map(async (rent) => {
                const rentDetails = [];

                for (let i = 0; i < rent.pId.length; i++) {
                    try {
                        // Fetch product details for each product ID
                        const product = await productModal.findOne(
                            { id: rent.pId[i] },
                            'name image time'
                        );

                        if (product) {
                            rentDetails.push({
                                _id: rent._id,
                                pId: rent.pId[i],
                                pName: product.name,
                                rent: rent.rent[i],
                                time: product.time,
                                quantity: rent.quantity[i],
                                fromDate: getFormateDate(rent.fromDate[i]),
                                toDate: getFormateDate(rent.toDate[i]),
                            days: rent.days[i],
                                total: rent.total[i],
                                image: product.image[0],
                                status: rent.status,
                            });
                        }
                    } catch (error) {
                        console.error('Error while fetching product details', error);
                        // Optionally, you could add a placeholder for failed products
                        rentDetails.push({
                            pId: rent.pId[i],
                            error: 'Failed to fetch product details',
                        });
                    }
                }

                return rentDetails;
            })
        );

        // Flatten the results array if necessary
        const flattenedResults = results.flat();

        // Send the response
        res.status(200).json(flattenedResults);
    } catch (error) {
        console.error('Error while fetching rents', error);
        res.status(500).json({ message: 'Error while fetching rents', error });
    }
};


module.exports = {
    getRents
}