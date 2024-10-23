const multer = require('multer');
const path = require('path');

const uploader = multer({storage: multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "Public/Images/Users")
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
    })
});

module.exports = uploader;