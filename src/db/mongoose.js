const mongoose = require('mongoose');

const connectionURL = process.env.MONGODB_URL;
mongoose.connect(connectionURL);
console.log('Connection to database');