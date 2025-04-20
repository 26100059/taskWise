const mongoose = require('mongoose');

require('dotenv').config();

const uri = process.env.MONGO_URI;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB Atlas using Mongoose");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
