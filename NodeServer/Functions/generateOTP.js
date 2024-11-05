const generateOTP = (len) => {
    let otp = '';
    for (let i = 0; i < len; i++) {
        otp += Math.floor(Math.random() * 10); // Generates a random digit from 0 to 9
    }
    return otp;
};

module.exports = generateOTP;