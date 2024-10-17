const nodemailer = require('nodemailer');

const sendMail = (subject, message, to) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587, 
        secure: false,
        auth: {
            user: process.env.MAIL_ADDRESS || 'from-email-address', // Use your actual email
            pass: process.env.MAIL_PASS || 'app-password' // Use actual password or app-specific password
        },
        tls: {
            rejectUnauthorized: true 
        }
    });

    const email = {
        from: process.env.MAIL_ADDRESS || 'your-email-address', // From email address // use your actual email address
        to: to,
        subject: subject,
        text: message,
        html: '', 
    };

    transporter.sendMail(email, (err, info) => {
        if (err) {
            return console.log('Error:', err);
        }
        console.log('Message sent:', info.messageId);
    });
};

module.exports = sendMail;
