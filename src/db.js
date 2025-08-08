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

const connect = async () => {
  try {
    await mongoose.connect("mongodb+srv://doadmin:G2rfdh8U51Q49u60@db-mongodb-syd1-49354-365d51c3.mongo.ondigitalocean.com/admin", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};


const close = async () => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('MongoDB disconnection failed:', error.message);
  }
};

module.exports = { connect, close};



