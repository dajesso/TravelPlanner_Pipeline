// import mongoose from 'mongoose'
const mongoose = require('mongoose');

// Section to connect to the database locally

// // Connect to MongoDB
// async function connect() {
// await mongoose.connect('mongodb://127.0.0.1:27017/travelp') // CHOOSE DB NAME
// console.log(mongoose.connection.readyState == 1 ? 'Mongoose connected' : 'Mongoose failed to connect!')
// }

// // Disconnect from MongoDB

// async function close() {
//   await mongoose.disconnect()
//   console.log(mongoose.connection.readyState == 0 ? 'Mongoose disconnected!' : 'Mongoose failed to disconnect!')
// }

// // Best practice export
// module.exports = { connect, close }

// Section to connect to the MongoDB Atlas

// unsure why this isn't working but this is a simple workaround.

console.log('Mongo URI:', process.env.MONGO_URI);

let mongoServer;

const connect = async () => {
  try {
    let mongoUri;

    if (process.env.MONGO_URI) {
      mongoUri = process.env.MONGO_URI;
      console.log('Using real MongoDB Atlas');
    } else {
      mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log('Using in-memory MongoDB');
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const close = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
      console.log('Stopped in-memory MongoDB');
    }
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('MongoDB disconnection failed:', error.message);
  }
};



module.exports = { connect, close};



