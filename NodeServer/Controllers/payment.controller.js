const Razorpay = require('razorpay');
const crypto = require('crypto');
const rentModal = require('../Models/rent.model');

// initialize razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.KEY_ID || 'your-key-id',
    key_secret: process.env.KEY_SECRET || 'your-key-secret'
});

// Create Razorpay order and return options
const getOptions = async (req, res) => {a
    try {
        const { total } = req.body;

        // Validate total amount
        if (!total || typeof total !== 'number') {
            return res.status(400).json({ message: 'Invalid amount provided' });
        }

        const order = await razorpay.orders.create({
            amount: total * 100, // Razorpay accepts amount in paise (multiply by 100)
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

const paymentVarification = (req, res) => {
    const p_id = req.params.P_ID; // id from req url.
    const {razorpay_payment_id, razorpay_order_id, razorpay_signature, data } = req.body; // get data from request body...

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !data || !p_id) // if anything missing then 
        return res.status(400).json({ message: 'Missing required payment details' });

    var generated_signature = crypto.createHmac('sha256', process.env.KEY_SECRET || "your-key-secret")
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest('hex');

    // Compare generated signature with Razorpay's signature
    if (generated_signature === razorpay_signature) {
        console.log("Payment verified successfully.");
        const uId = "670e12a0943359360b1789e1";
        const newRent = {
            pId: p_id,
            uId: uId,
            fromDate: data.fromDate,
            toDate: data.toDate,
            quantity: data.quantity,
            rent: data.rent,
            days: data.days,
            total: data.total
        }
        
        rentModal.create(newRent)
        .then((response)=> {
            console.log(response)
        })
        .catch((error) => {
            console.log("error while creating new rent")
            res.status(500).json({message: "Error while creating Rent", error})
        })
    } else {
        console.error("Invalid payment signature.");
        return res.status(400).json({ message: 'Invalid payment signature.' });
    }
}

module.exports = {
    getOptions,
    paymentVarification,
}