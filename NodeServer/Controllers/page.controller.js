const home = (req, res) => {
    res.status(200).json({message: "This is home page!"});
}
const about = (req, res) => {
    res.status(200).json({message: "This is about page!"});
}
const contact = (req, res) => {
    res.status(200).json({message: "This is contact page!"});
}

module.exports = {
    home,
    about,
    contact
};