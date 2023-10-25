const config = require('../../src/config')
const Report = require('../models/Report');
const mongoose = require('mongoose');

const connectToMongoDB = async () => {
    try {
        const username = config.mongoDBLogin.username;
        const password = config.mongoDBLogin.password;

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
                //Test how to insert into the DB
            const testReport = new Report({
                user_id: "User1",
                primary_communication: "Driver",
                leadership_style: "Dominant",
                communication_style: "Verbal",
                self_efficacy_level: "Low"
            })
        
            testReport.save()
            .then((result) => {
                console.log('Report saved to the database:', result);
            })
            .catch((error) => {
                console.error('Error saving report:', error);
            });
        
            //Test how to retrieve from the DB
            Report.find().then(function(documents){
                console.log(documents);
             })
        });

    } catch (err) {
        console.log("Failed to connect to db");
    }
}

connectToMongoDB();