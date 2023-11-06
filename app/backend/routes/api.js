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
        // Check if a session already exists with these users
        const sessionUserOne = await Session.findOne({ $or: [{ user1_id: user1Id }, { user2_id: user1Id }] });
        const sessionUserTwo = await Session.findOne({ $or: [{ user1_id: user2Id }, { user2_id: user2Id }] });

        if (sessionUserOne || sessionUserTwo) {
            res.status(409).send("Session already exists with these users");
        } else {
            await session.save();
            res.send(session);
        }
    } catch (err) {
        res.status(500).send("Failed to insert Session");
    }
});

// Insert a new User
router.post("/users/:user_id", async (req, res) => {
    const user = new User({
        user_id: req.params.user_id,
        lines_of_code: 0,
        num_role_changes: 0,
        expression_scores: [0],
        num_interruptions: 0    
    });
    
    try {
        const sessionUser = await Session.findOne({ $or: [{ user1_id: req.params.user_id }, { user2_id: req.params.user_id }] });
        if (!sessionUser) {
            res.status(409).send("A session does not exist with these users ");
        }

        await user.save();
        res.send(user);
    } catch(err) {
        res.status(500).end("Failed to insert User");
    }
});

// Insert a new utterance
router.post("/utterances", async (req, res) => {
    const utterance = new Utterance({
        user_id: req.body.user_id,
        start_time: req.body.start_time,  
        end_time: req.body.end_time,
        transcript: req.body.transcript  
    });
    try {
        const sessionUser = await Session.findOne({ $or: [{ user_id: req.body.user_id }, { user2_id: req.body.user_id }] });

        if (!sessionUser) {
            res.status(409).send("A session does not exist with these users");
        }

        await utterance.save();
        res.send(utterance);
    } catch(err) {
        res.status(500).send("Failed to insert Utterance");
    }  
});

// Insert a report
router.post("/reports", async (req, res) => {
    const report = new Report({
        user_id: req.body.user_id,
        primary_communication: req.body.primary_communication,
        leadership_style: req.body.leadership_style,
        communication_style: req.body.communication_style,
        self_efficacy_level: req.body.self_efficacy_level  
    });
    try {
        const sessionUser = await Session.findOne({ $or: [{ user1_id: req.body.user_id }, { user2_id: req.body.user_id }] });

        if (!sessionUser) {
            res.status(409).send("A session does not exist with these users");
        }

        await report.save();
        res.send(report);
    } catch(err) {
        res.status(500).send("Failed to insert Report");
    }  
});

// Retrive a user's partner in a session
router.get("/sessions/:user_id", async (req, res) => {
    const userId = req.params.user_id;
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
router.get("/utterances/:user_id", async (req, res) => {
    const userId = req.params.user_id;
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
router.get("/reports/:user_id", async (req, res) => {
    const userId = req.params.user_id;
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
router.put("/users/:user_id/expressionScore/:new_score", async (req, res) => {
    const userId = req.params.user_id;
    const newScore = req.params.new_score;
    try {
        const user = await User.findOne({user_id: userId});
        
        if(!user) {
            res.status(401).send(`${userId} does not exist`);
        }

        await User.updateOne(
            { user_id: user_id },
            { $push: { expression_scores: newScore } });
        res.send(`Successfully updated ${userId}'s expression score`);
    } catch(err) {
        res.status(500).send(`Failed to update ${userId}'s expression score`);
    }
});

//Calculates the number of times a user has been interrupted by their partner
router.get('/utterances/interruptions/:user_id/:partner_id', async (req, res) => {
    const userId = req.params.user_id;
    const partnerId = req.params.partner_id;
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