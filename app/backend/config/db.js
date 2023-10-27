const config = require('../config')
const mongoose = require('mongoose');

const connectToMongoDB = async () => {
    try {
        const username = config.mongoDBLogin.username;
        const password = config.mongoDBLogin.password;

        // Connect to the MongoDb database that is running on the NCSU VM
        mongoose.connect('mongodb://sd-vm01.csc.ncsu.edu:27017/pairProgrammingTool', {
            auth: {
                username: username,
                password: password,
              },
        }).then(
            () => { 
                console.log("Connected to DB!");
            },
            err => { 
                console.log(err);
            }
        );

        mongoose.connection.on('open', function(){
            console.log("Connection to Mongo DB is open!");
        });
    } catch (err) {
        console.log("Failed to connect to db");
    }
}

connectToMongoDB();