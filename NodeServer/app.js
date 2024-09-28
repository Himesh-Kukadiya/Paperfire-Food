const express = require('express');
const env = require('dotenv');

// creating app from express...
const app = express();

// env configuration...
env.config();

// Middleware to parse JSON request bodies...
app.use(express.json());

// routings...
const router = require('./RouteManager/Router');
app.use('/api', router);

const PORT = process.env.PORT || 7575;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})