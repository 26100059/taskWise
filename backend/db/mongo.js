// db/mongo.js
const mongoose = require('mongoose');
// require('dotenv').config(); // Ensure environment variables are loaded

const uri = process.env.MONGO_URI || "mongodb+srv://taskWiseDB:taskWiseAdmin@taskwisedb.d4zpp.mongodb.net/?retryWrites=true&w=majority&appName=taskWiseDB";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to MongoDB Atlas using Mongoose");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process if connection fails
  }
};

module.exports = connectToDatabase;
