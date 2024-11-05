const express = require('express');
const env = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session')

// env configuration...
env.config();

// MongoDB connection...
const connect = () => {
    mongoose.connect(`${process.env.DB_URL}${process.env.DB_NAME}`)
    .then(() => console.log(`Connected to MongoDB ${process.env.DB_NAME}`))
    .catch(err => console.error(`Failed to connect to MongoDB: ${err}`));
}
connect();

// creating app from express...
const app = express();

// Middleware to handle Session
app.use(session({secret: "Users OPT"}))

// Middleware to parse JSON request bodies...
app.use(express.json());

// Middleware to handle CORS...
app.use(cors());

// allow to access image files
app.use(express.static('Public'))

// routings...
const router = require('./RouteManager/Router');
app.use('/api', router);
// uploading files
const fileUploaderRouter = require("./RouteManager/FileUploadRouter")
app.use("/uploads", fileUploaderRouter);

const PORT = process.env.PORT || 7575;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})