require('dotenv').config();
module.exports = {

    mongoDBLogin: {
        username: process.env.MONGO_USERNAME,
        password: process.env.MONGO_PASSWORD
    }
}