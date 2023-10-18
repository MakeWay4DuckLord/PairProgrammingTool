import mongoose from 'mongoose';
const { Schema } = mongoose;
import { Utterance } from './Utterance'
import { Report } from './Report'

const userSchema = new Schema({
    user_id: String,
    lines_of_code: Number,
    num_role_changes: Number,
    expression_scores: [Number],
    num_interruptions: Number,
    utterances: [ Utterance ],
    report: Report
    
});

module.exports = mongoose.model("User", userSchema);