const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const User = require("../models/User");
const Utterance = require("../models/Utterance");
const Report = require("../models/Report");

// Insert a Session
router.post("/sessions", async (req, res) => {
    const session = new Session({
        user1_id: req.body.user1,
        user2_id: req.body.user2
    });
    try {
        await session.save();
        res.send(session);
    } catch(err) {
        res.status(500).send("Failed to insert Session " + err);
    }
});

// Insert a new User
router.post("/users", async (req, res) => {
    const user = new User({
        user_id: "User1",
        lines_of_code: 0,
        num_role_changes: 0,
        expression_scores: [0],
        num_interruptions: 0    
    });
    
    try {
        await user.save();
        res.send(user);
    } catch(err) {
        res.status(500).end("Failed to insert User " + err);
    }
});

// Insert a new utterance
router.post("/utterances", async (req, res) => {
    const utterance = new Utterance({
        user_id: req.body.userId,
        is_navigator: req.body.isNavigator,
        start_time: req.body.startTime,  
        end_time: req.body.endTime,
        transcript: req.body.transcript  
    });
    try {
        await utterance.save();
        res.send(utterance);
    } catch(err) {
        res.status(500).send("Failed to insert Utterance " + err);
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
        res.send("Failed to insert Utterance " + err);
    }  
});

// Retrive a user's partner in a session
router.get("/sessions/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        const session = await Session.findOne({user1_id: userId });
        res.send(session.user2_id);
    } catch(err) {
        try {
            const session = await Session.findOne({user2_id: userId });
            res.send(session.user1_id);
        } catch(err) {
            res.send("User Id has not been registered " + err);
        }
    }
});

//Retrieve a user's latest utterance
router.get("/utterances/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        const utterance = await Utterance.findOne({user_id: userId }).sort({_id: -1});
        res.send(utterance);
    } catch(err) {
        res.send("No utterances exist for user " + userId);
    }
});

//Retrieve a user's report
router.get("/reports/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        const report = await Report.findOne({user_id: userId }).sort({_id: -1});
        res.send(report);
    } catch(err) {
        res.send("Report does not exist");
    }
});

//Delete all utterances
//This is used at the end of a session to clean up the collection
router.delete("/utterances", async (req, res) => {
    try {
        await Utterance.deleteMany({});
        res.send("Successfully deleted all utterances");
    } catch(err) {
        res.send("Failed to delete utterances");
    }
});

module.exports = router;