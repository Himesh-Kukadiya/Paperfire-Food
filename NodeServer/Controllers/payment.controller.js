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
        
        rentModal.create({
            pId: p_id,
            uId: uId,
            fromDate: data.fromDate,
            toDate: data.toDate,
            quantity: data.quantity,
            rent: data.rent,
            days: data.days,
            total: data.total,
            mobile: data.mobile,
            address: data.address,
            city: data.city,
            state: data.state,
            zip: data.zip
        })
        .then((rent)=> {
            if(!rent) return res.status(500).json({message: "Rent Creation Failed"})

            paymentModal.create({
                rId: rent._id,
                amount: rent.total,
                payment_id: razorpay_payment_id,
                order_id: razorpay_order_id,
                signature: razorpay_signature,
                paymentStatus: "paid",
                paymentDate: getFormateDate(new Date()),
                paymentMethod: "razorpay"
            })
            .then((payment)=> {
                if(!payment) return res.status(500).json({message: "Payment Creation Failed"})
                
                productModal.findById(rent.pId)
                .then((product) => {
                    const subject = `PaperFireFood Rent Confirmation: Your Booking is Successful`;
                    const message = `Dear ${data.name},\n\n
We are excited to confirm your recent rent booking with PaperFireFood! Below are the details of your order:\n
- Booking Reference: ${rent._id}
- Product Rented: ${product.name} (${product.rent}${product.time})
- Rental Period: From ${getFormateDate(rent.fromDate)} to ${getFormateDate(rent.toDate)}
- Quantity: ${rent.quantity}
- Total Amount Paid: ₹${rent.total}
- Payment ID: ${payment._id}\n
Delivery Information:\n
- Mobile Number: ${rent.mobile}
- Address: ${rent.address}, ${rent.city}, ${rent.state} - ${rent.zip}\n\n
Thank you for choosing PaperFireFood for your restaurant equipment needs. Should you have any questions or require assistance, feel free to contact us. Drop mail on ${process.env.MAIL_ADDRESS}\n\n
Best regards,\n
The PaperFireFood Team\n\n
*Please keep this email for your records. Do not delete it for future reference.*`;
                    const to = data.email;

                    sendMail(subject, message, to)
                        res.status(200).json({ message: "Payment and Rent Created Successfully"});
                })
                .catch((err) => {
                    console.log("error while finding product", err)
                    res.status(500).json({message: "Error while finding product", err});
                })
            })
            .catch((error)=> { 
                console.log("error while creating payment");
                res.status(500).json({message: "Error while creating payment", error});
            });
        })
        .catch((error) => {
            console.log("error while creating new rent")
            res.status(500).json({message: "Error while creating Rent", error})
        })
        // paymentModal.create({})

    } else {
        console.error("Invalid payment signature.");
        return res.status(400).json({ message: 'Invalid payment signature.' });
    }
}

module.exports = {
    getOptions,
    paymentVarification,
}