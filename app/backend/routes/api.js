const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const User = require("../models/User");
const Utterance = require("../models/Utterance");
const Report = require("../models/Report");

// Insert a Session
router.post("/sessions/:user1_id/:user2_id", async (req, res) => {
    const user1Id = req.params.user1_id;
    const user2Id = req.params.user2_id;

    const session = new Session({
        user1_id: user1Id,
        user2_id: user2Id
    });

    try {

        //check if a session already exists with these users
        const sessionUserOne1 = await Session.findOne({user1_id: user1Id });
        const sessionUserOne2 = await Session.findOne({user2_id: user1Id });
        const sessionUserTwo1 = await Session.findOne({user1_id: user2Id });
        const sessionUserTwo2 = await Session.findOne({user2_id: user2Id });

        if(sessionUserOne1 || sessionUserOne2 || sessionUserTwo1 || sessionUserTwo2) {
            res.status(500).send("User id has already been registered");
        }


        await session.save();
        res.send(session);
    } catch(err) {
        res.status(500).send("Failed to insert Session");
    }
});

// Insert a new User
router.post("/users/:userId", async (req, res) => {
    const user = new User({
        user_id: req.params.userId,
        lines_of_code: 0,
        num_role_changes: 0,
        expression_scores: [0],
        num_interruptions: 0    
    });
    
    try {
        await user.save();
        res.send(user);
    } catch(err) {
        res.status(500).end("Failed to insert User");
    }
});

// Insert a new utterance
router.post("/utterances", async (req, res) => {
    const utterance = new Utterance({
        user_id: req.body.userId,
        start_time: req.body.startTime,  
        end_time: req.body.endTime,
        transcript: req.body.transcript  
    });
    try {
        await utterance.save();
        res.send(utterance);
    } catch(err) {
        res.status(500).send("Failed to insert Utterance");
    }  
});

// Insert a report
router.post("/reports", async (req, res) => {
    const report = new Report({
        user_id: req.body.userId,
        primary_communication: req.body.primaryCommunication,
        leadership_style: req.body.leadershipStyle,
        communication_style: req.body.communicationStyle,
        self_efficacy_level: req.body.selfEfficacyLevel  
    });
    try {
        await report.save();
        res.send(report);
    } catch(err) {
        res.status(500).send("Failed to insert Report");
    }  
});

// Retrive a user's partner in a session
router.get("/sessions/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        const session = await Session.findOne({user1_id: userId });

        if(!session) {
            const session2 = await Session.findOne({user2_id: userId });
            if(!session2) {
                res.status(401).send(`A session for ${userId} does not exist`);
            }
            res.send(session.user2_id);            
        } else {
            res.send(session.user1_id);
        }
        
    } catch(err) {
        res.status(500).send(`An error has occured retrieving ${userId}'s partner`);
    }
});

//Retrieve a user's latest utterance
router.get("/utterances/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        const utterance = await Utterance.findOne({user_id: userId }).sort({_id: -1});

        if(!report) {
            res.status(401).send(`An utterance for ${userId} does not exist`);
        }

        res.send(utterance);
    } catch(err) {
        res.status(500).send(`An error has occured retrieving ${userId}'s latest utterance ` );
    }
});

//Retrieve a user's report
router.get("/reports/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        const report = await Report.findOne({user_id: userId }).sort({_id: -1});

        if(!report) {
            res.status(401).send(`A report for ${userId} does not exist`);
        }

        res.send(report);
    } catch(err) {
        res.status(500).send("Failed to retrieve Report");
    }
});

//Delete all utterances
//This is used at the end of a session to clean up the collection
router.delete("/utterances", async (req, res) => {
    try {
        await Utterance.deleteMany({});
        res.send("Successfully deleted all utterances");
    } catch(err) {
        res.status(500).send("Failed to delete utterances");
    }
});

//Adds an expression score to the array of scores a user has
//This is updated every 5 minutes
router.put("/users/:userId/expressionScore/:newScore", async (req, res) => {
    const userId = req.params.userId;
    const newScore = req.params.newScore;
    try {
        const user = await User.findOne({user_id: userId});
        
        if(!user) {
            res.status(401).send(`${userId} does not exist`);
        }

        await User.updateOne(
            { user_id: userId },
            { $push: { expression_scores: newScore } });
        res.send(`Successfully updated ${userId}'s expression score`);
    } catch(err) {
        res.status(500).send(`Failed to update ${userId}'s expression score`);
    }
});

//Calculates the number of times a user has been interrupted by their partner
router.get('/utterances/interruptions/:userId/:partnerId', async (req, res) => {
    const userId = req.params.userId;
    const partnerId = req.params.partnerId;
    try {
        const utterances = await Utterance.find({user_id: userId });

        if(!utterances) {
            res.status(401).send(`No utterances exist for ${userId}`);
        }

        var interruptionCount = 0;

        for(utterance of utterances) {
            const start = utterance.start_time;
            const end = utterance.end_time;

            const interruptions = await Utterance.find({user_id: partnerId, start_time: {$gte : start, $lte: end}});

            if(interruptions) {
                interruptionCount += interruptions.length;
            }
        }        
        res.send(`${interruptionCount}`);
        
    } catch(err) {
        res.status(500).send(`Failed to retrieve interruptions for ${userId} `);
    }
});

module.exports = router;