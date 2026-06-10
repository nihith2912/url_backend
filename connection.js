const mongoose = require('mongoose');
require('dotenv').config();
async function connectMongoDB(url){
    return mongoose.connect(url);
}
module.exports = connectMongoDB;