const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../server");
const { MongoMemoryServer } = require('mongodb-memory-server');
require("dotenv").config();


let mongod;
beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = await mongod.getUri();

    const mongooseOpts = {
        useNewUrlParser: true,
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000
    };

    await mongoose.connect(uri, mongooseOpts);
});
  
afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
});

describe("session", () => {
    describe("creating a session", () => {
        describe("given 2 users who haven't been registered", () => {
            it("should return the session payload", async () => {
                const res = await supertest(app).post('/api/sessions/User1/User2');
                expect(res.statusCode).toBe(200);
                expect(res.body.length).toBeGreaterThan(0);
            });
        });
    });
});