const mongoose = require('mongoose');

mongoose.connect('mongodb://db:27017/kuttal');


const userSchema = new mongoose.Schema({
  name: String,
  email: String
});
const User = mongoose.model('User', userSchema);


module.exports = {
  mongoose: mongoose,
  Schema: mongoose.Schema,
  User: User
};