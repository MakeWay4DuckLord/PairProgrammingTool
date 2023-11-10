const db = require('./DB.js');

class UserDAO {

  // Create a new user
  create(name, email) {
    const newUser = new db.User({
      name: name,
      email: email
    });
    return newUser.save();
  }

  // Find all users
  findAll() {
    return db.User.find();
  }

  // Find a user by name
  find(name) {
    return db.User.find({name: name});
  }

  // Update a user's age
  updateAge(name, age) {
    return db.User.findOneAndUpdate({name: name}, {age: age});
  }

  // Delete a user
  delete(name) {
    return db.User.findOneAndDelete({name: name});
  }
}

module.exports = UserDAO;