require('dotenv').config();
module.exports = {
    sshConfig: {  
        username: process.env.SSH_USERNAME,
        password: process.env.SSH_PASSWORD,
        host: 'sd-vm01.csc.ncsu.edu',
    },

    tunnelConfig: {
        localAddress: '127.0.0.1',
        localPort: 27017,
        remoteAddress: 'localhost',
        remotePort: 27017,
    },

    mongoDBLogin: {
        username: process.env.MONGO_USERNAME,
        password: process.env.MONGO_PASSWORD
    }
}