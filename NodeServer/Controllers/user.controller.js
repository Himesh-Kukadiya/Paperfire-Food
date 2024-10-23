const usersModel = require('../Models/users.model');

const userRegistration = (req, res) => {
    const { email } = req.body;
    usersModel.findOne({ email: email })
        .then((data) => {
            if (data) {
                return res.status(409).json({ message: "This account is all ready exists" });
            }
            else {
                usersModel.create(req.body)
                    .then((response) => {
                        console.log("User created successfully")
                        return res.status(200).json({ message: "Registration Successful", data: response })
                    })
                    .catch((err) => {
                        console.log("Error while creating user", err)
                        return res.status(500).json({ message: "Error while creating user", error: err })
                    })
            }
        })
        .catch((error) => {
            console.log("Error while checking user existence", error)
            return res.status(500).json({ message: "Error while checking user existence", error: error })
        })
}

const userLogin = (req, res) => {
    const { email, password } = req.body;
    usersModel.findOne({ email: email })
        .then((user) => {
            if (!user) return res.status(404).json({ message: "User not found" });
            else {
                if (user.password === password) return res.status(200).json({ message: "Login Successful", data: user });
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

module.exports = {
    userRegistration,
    userLogin,
    updateProfile,
    profileImageUpload,
}