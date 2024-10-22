const usersModel = require('../Models/users.model');

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

module.exports = {
    userLogin
}