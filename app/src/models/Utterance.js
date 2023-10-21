const mongoose = require('mongoose');
const { Schema } = mongoose;

const utteranceSchema = new Schema ({
    user_id: String,
    is_navigator: Boolean,
    start_time: String,  
    end_time: String,
    transcript: String
});

module.exports = mongoose.model("Utterance", utteranceSchema);