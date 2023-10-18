import mongoose from 'mongoose';
const { Schema } = mongoose;

const reportSchema = new Schema({
    primary_communication: String,
    leadership_style: String,
    communication_style: String,
    self_efficacy_level: String
});

module.exports = mongoose.model("Report", reportSchema);
