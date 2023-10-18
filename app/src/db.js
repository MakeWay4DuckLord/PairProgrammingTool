const mongoose = require('mongoose');
const SSH2Promise = require('ssh2-promise');
const config = require('./config')

const connectToMongoDB = async () => {
  const sshConfig = config.sshConfig;
  const tunnelConfig = config.tunnelConfig;
  const ssh = new SSH2Promise(sshConfig);
  try {
    
    await ssh.connect(sshConfig);
    await ssh.addTunnel(tunnelConfig);
    mongoose.connect(`mongodb://${ config.mongoDBLogin.username }:${ config.mongoDBLogin.password }@localhost:27017/pairProgrammingTool`);

    var db = mongoose.connection;

    // Now, 'collections' contains an array of all collections in the database
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
