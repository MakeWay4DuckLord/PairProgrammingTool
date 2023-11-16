db.auth('kuttalAdmin', 'seniorDesign0012023');

db = db.getSiblingDB('pairProgrammingTool');
db.createCollection('users');
db.createCollection('sessions');
db.createCollection('utterances');