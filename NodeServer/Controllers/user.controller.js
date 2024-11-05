const { verify } = require('crypto');

const usersModel = require('../Models/users.model');
const generateOTP = require('../Functions/generateOTP');
const sendMail = require('../Functions/sendMail');

let cntr = 1;
const NodeCache = require('node-cache');
class SecureOTP {
    constructor() {
        const otpCache = new NodeCache({ stdTTL: 10 * 60, checkperiod: 10 * 60});

        this.addOtp = (email, otp) => {
            otpCache.set(email, otp);
        };

        this.getOtp = (email) => {
            return otpCache.get(email);
        };

        this.getAllOtps = () => {
            return otpCache.keys().reduce((acc, key) => {
                acc[key] = otpCache.get(key);
                return acc;
            }, {});
        };

        this.removeOtp = (email) => {
            otpCache.del(email);
        };
    }
}

const otps = new SecureOTP();

const userRegistration = (req, res) => {
    const { email, type } = req.body;
    usersModel.findOne({ email: email })
        .then((data) => {
            if (data) {
                return res.status(409).json({ message: "User all ready exists" });
            }
            else return res.status(200).json({ message: "Registration Successful", data: req.body })
        })
        .catch((error) => {
            console.log("Error while checking user existence", error)
            return res.status(500).json({ message: "Error while checking user existence", error: error })
        })
}

const sendOTP = (req, res) => {
    const { email, name } = req.body;

    const otp = generateOTP(6);
    otps.addOtp(email, otp); 
    console.log(otps.getAllOtps()); 

    const subject = "Your One-Time Password (OTP) for Account Verification";
    const message = `
Dear ${name},

To complete your verification, please use the following One-Time Password (OTP):

OTP: ${otp}

This OTP is valid for the next 10 minutes. Please do not share this code with anyone.

If you did not request this code, please ignore this message or contact support at paperfirefood75@gmail.com.

Best regards,
Your Support Team
`;

    sendMail(subject, message, email);
    
    res.status(200).json({ message: "OTP sent successfully" });
};

const verifyOTP = (req, res) => {
    const { email, otp } = req.body;
    const storedOtp = otps.getOtp(email);

    if (storedOtp && storedOtp === otp) {
        otps.removeOtp(email); 
        return res.status(200).json({ message: "OTP verified successfully" });
    } else {
        return res.status(401).json({ message: "OTP does not match or has expired" });
    }
};


const userLogin = (req, res) => {
    const { email, password } = req.body;
    usersModel.findOne({ email: email })
        .then((user) => {
            if (!user) return res.status(404).json({ message: "User not found" });
            else {
                if (user.password === password) {
                    const userObj = user.toObject();
                    delete userObj.password;
                    delete userObj.__v;
                    return res.status(200).json({ message: "Login Successful", data: userObj });
                }
                else return res.status(401).json({ message: "Invalid Cradentials" });
            }
        })
        .catch((err) => {
            console.log("Error while finding user", err)
            return res.status(500).json({ message: "Error while finding user", error: err })
        })
}

const updateProfile = (req, res) => {
    const data = req.body;

    usersModel.findByIdAndUpdate(data._id, data, { new: true })
    .then((userData) => {
        res.status(200).json({ message: "profile updated successfully", userData});
    })
    .catch((err) => {
        console.log("Error while updating user profile", err)
        res.status(500).json({ message: "Error while updating user profile", error: err });
    });
}

const profileImageUpload = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const {userId} = req.body
    const {filename} = req.file;

    usersModel.findByIdAndUpdate(userId, { imageURL: filename }, { new: true })
    .then(() => {
        res.status(200).json({ message: "Profile image uploaded successfully", imageURL: filename });
    })
    .catch(err => {
        console.log("Error while updating user profile image", err)
        res.status(500).json({ message: "Error while updating user profile image", error: err });
    })
};

const changePassword = (req, res) => { 
    const {email, password} = req.body;

    usersModel.findOneAndUpdate({ email: email }, { password: password }, { new: true })
    .then(() => res.status(200).json({ message: "Password updated successfully"}))
    .catch(err => {
        console.log("Error while updating password", err)
        res.status(500).json({ message: "Error while updating password", error: err });
    })
}

const logOtps = (req, res) => {
    console.log("------------------------------------------------------------- " + cntr);
    console.log(otps.getAllOtps())
    res.send("cnt is " + cntr++)
};

module.exports = {
    userRegistration,
    userLogin,
    updateProfile,
    profileImageUpload,
    sendOTP,
    verifyOTP,
    changePassword,
    logOtps,
}