const { MongoClient, Logger } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const debug = require('debug')('mongodb');
process.env.DEBUG = 'mongodb';
var dbConn;
const SCHEMA = `blogs`;
const url = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${SCHEMA}?connectTimeoutMS=10000&authSource=${process.env.MONGO_AUTH_SOURCE}&authMechanism=SCRAM-SHA-1`;

const Mongo = {
    getDbConnection: async function () {
        if (!dbConn) {
            const client = await init();
            dbConn = client.db(SCHEMA);
        }
        return dbConn;
    },
    ObjectID: ObjectId
}   
Mongo.getDbConnection();
async function init() {
    const client = new MongoClient(url, {
        maxPoolSize: 5,
        wtimeoutMS: 25000,
        connectTimeoutMS: 1000,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    await client.connect();
    console.log("initializing mongo client configs");
    return client;
}
module.exports = Mongo; 