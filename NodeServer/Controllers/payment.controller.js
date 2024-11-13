const Razorpay = require('razorpay');
const crypto = require('crypto');

const rentModal = require('../Models/rent.model');
const paymentModal = require('../Models/payment.model');
const productModal = require("../Models/product.model");

const getFormateDate = require('../Functions/getFormateDate');
const sendMail = require('../Functions/sendMail');

// initialize razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.KEY_ID || 'your-key-id',
    key_secret: process.env.KEY_SECRET || 'your-key-secret'
});

// Create Razorpay order and return options
const getOptions = async (req, res) => {
    try {
        let { totalAmt } = req.body;

        // Validate total amount
        if (!totalAmt || typeof totalAmt !== 'number') {
            return res.status(400).json({ message: 'Invalid amount provided' });
        }

        const order = await razorpay.orders.create({
            amount: totalAmt * 100, // Razorpay accepts amount in paise (multiply by 100)
            currency: 'INR',
            receipt: 'order_receipt_' + Math.floor(Date.now() / 1000)
        });

        if (!order) return res.status(500).json({ message: 'Error while creating order' });

        const options = {
            key: process.env.KEY_ID || 'your-api-key',
            amount: order.amount,
            currency: 'INR',
            name: 'Paper Fire Food',
            description: 'Pay & get product at your doorstep for rent...',
            image: 'https://media.geeksforgeeks.org/wp-content/uploads/20210806114908/dummy-200x200.png',
            order_id: order.id,
            callback_url: `http://localhost:7575/api/paymentVarification`,
            prefill: {
                name: req.body.name,
                email: req.body.email,
                contact: req.body.mobile
            },
            notes: {
                access: 'This payment is for your product on rent...'
            },
            theme: {
                color: '#121212'
            }
        };

        // Send options to frontend
        res.status(200).json({ options });
    } catch (error) {
        console.error('Error in creating Razorpay order:', error);
        res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
};

const paymentVerification = (req, res) => {
    const userId = req.params.userId;

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, data } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !data || !userId)
        return res.status(400).json({ message: 'Missing required payment details' });

    const generated_signature = crypto.createHmac('sha256', process.env.KEY_SECRET || "your-key-secret")
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest('hex');

    if (generated_signature === razorpay_signature) {
        rentModal.create(data)
            .then((rent) => {
                if (!rent) return res.status(500).json({ message: "Rent Creation Failed" });

                let totalAmt = 0;
                rent.total.forEach(amount => totalAmt += amount);

                paymentModal.create({
                    rId: rent._id,
                    amount: totalAmt,
                    payment_id: razorpay_payment_id,
                    order_id: razorpay_order_id,
                    signature: razorpay_signature,
                    paymentStatus: "paid",
                    paymentDate: getFormateDate(new Date()),
                })
                    .then(async (payment) => {
                        if (!payment) return res.status(500).json({ message: "Payment Creation Failed" });

                        const pDetails = [];
                        const pDuration = [];

                        for (let i = 0; i < rent.pId.length; i++) {
                            try {
                                const product = await productModal.findOne({ id: rent.pId[i] });
                                if (!product) return res.status(404).json({ message: "Product not found" });

                                pDetails.push(`${product.name} (${product.rent}${product.time})`);
                                pDuration.push(`From ${getFormateDate(rent.fromDate[i])} To ${getFormateDate(rent.toDate[i])}`);
                            } catch (error) {
                                console.error("Error while fetching product details", error);
                                return res.status(500).json({ message: "Error while fetching product details", error });
                            }
                        }

                        const subject = `PaperFireFood Rent Confirmation: Your Booking is Successful`;

                        const bill = `
                            <p>Dear ${data.name},</p>
                            
                            <p>We are excited to confirm your recent rent booking with PaperFireFood! Below are the details of your order:</p>

                            <p><strong>Booking Reference:</strong> ${rent._id}</p>
                            <p><strong>Payment ID:</strong> ${payment._id}</p>
                            <p><strong>Total Amount Paid:</strong> ₹${data.totalAmt}</p>
                            
                            <h3>Product Details</h3>
                            <table style="border-collapse: collapse; width: 100%;">
                                <thead>
                                <tr>
                                    <th style="border: 1px solid #ddd; padding: 8px;">Product Rented</th>
                                    <th style="border: 1px solid #ddd; padding: 8px;">Rental Period</th>
                                    <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
                                    <th style="border: 1px solid #ddd; padding: 8px;">Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                    ${pDetails.map((product, index) => {
                                        return `
                                            <tr>
                                                <td style="border: 1px solid #ddd; padding: 8px;">${product}</td>
                                                <td style="border: 1px solid #ddd; padding: 8px;">${pDuration[index]}</td>
                                                <td style="border: 1px solid #ddd; padding: 8px;">${rent.quantity[index]}</td>
                                                <td style="border: 1px solid #ddd; padding: 8px;">₹${rent.rent[index] * rent.quantity[index] * rent.days[index]}</td>
                                            </tr>
                                        `;
                                    }).join("")}
                                    <tr style="font-weight: bold;">
                                        <td style="border: 1px solid #ddd; padding: 8px;" colspan="3">Delivery Charge</td>
                                        <td style="border: 1px solid #ddd; padding: 8px;">₹${data.shippingPrice}</td>
                                    </tr>
                                    <tr style="font-weight: bold;">
                                        <td style="border: 1px solid #ddd; padding: 8px;" colspan="3">Grand Total</td>
                                        <td style="border: 1px solid #ddd; padding: 8px;">₹${data.totalAmt + data.shippingPrice}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <h3>Delivery Information:</h3>
                            <p>
                                <strong>Mobile Number:</strong> ${rent.mobile}<br>
                                <strong>Address:</strong> ${rent.address}, ${rent.city}, ${rent.state} - ${rent.zip}
                            </p>

                            <p>Thank you for choosing PaperFireFood for your restaurant equipment needs. Should you have any questions or require assistance, feel free to contact us at <a href="mailto:${process.env.MAIL_ADDRESS}">${process.env.MAIL_ADDRESS}</a>.</p>

                            <p>Best regards,<br>
                            The PaperFireFood Team</p>

                            <p><em>*Please keep this email for your records. Do not delete it for future reference.*</em></p>
                        `;

                        sendMail(subject, "", bill, data.email);
                        return res.status(200).json({ message: "Payment and Rent Created Successfully" });
                    })
                    .catch((error) => {
                        console.error("Error while creating payment", error);
                        return res.status(500).json({ message: "Error while creating payment", error });
                    });
            })
            .catch((error) => {
                console.error("Error while creating Rent", error);
                return res.status(500).json({ message: "Error while creating Rent", error });
            });
    } else {
        console.error("Invalid payment signature.");
        return res.status(400).json({ message: 'Invalid payment signature.' });
    }
};


module.exports = {
    getOptions,
    paymentVerification,
}