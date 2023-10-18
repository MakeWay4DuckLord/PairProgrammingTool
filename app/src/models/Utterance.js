import mongoose from 'mongoose';
const { Schema } = mongoose;

const utteranceSchema = new Schema ({
    is_navigator: Boolean,
    start_time: String,  
    end_time: String,
    transcript: String
});

module.exports = mongoose.model("Utterance", utteranceSchema);