const mongoose = require('mongoose');
const SSH2Promise = require('ssh2-promise');
const config = require('./config')
const Report = require('./models/Report');

const connectToMongoDB = async () => {
  const sshConfig = config.sshConfig;
  const tunnelConfig = config.tunnelConfig;
  const ssh = new SSH2Promise(sshConfig);
  try {
    
    await ssh.connect(sshConfig);
    await ssh.addTunnel(tunnelConfig);
    const username = encodeURIComponent(config.mongoDBLogin.username);
    const password = encodeURIComponent(config.mongoDBLogin.password);

    mongoose.connect(`mongodb://localhost:27017/pairProgrammingTool`, {
      auth: {
        username: username,
        password: password,
      },
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    var db = mongoose.connection;

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
    Report.findOne({ user_id: 'User1' }, (err, report) => {
      if (err) {
        console.error('Error:', err);
      } else {
        console.log('Report:', report);
      }
    });

    console.log('Connected to MongoDB via SSH tunnel.');
    console.log('All collections:', db.collections);
  } catch (err) {
    console.error(err);
    console.log('Failed to establish the SSH tunnel.');
  } finally {
    ssh.close();
  }
}

connectToMongoDB();
