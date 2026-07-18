const mongoose = require("mongoose");

// Disable buffering so queries fail instantly when disconnected instead of hanging
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  const uris = [
    process.env.MONGO_URI,
    "mongodb://127.0.0.1:27017/angaar",
    "mongodb://localhost:27017/angaar"
  ];

  for (const uri of uris) {
    if (!uri) continue;
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
      console.log(`MongoDB connected successfully to: ${uri.includes('localhost') || uri.includes('127.0.0.1') ? 'Local Database' : 'Cloud Database'}`);
      return;
    } catch (err) {
      console.warn(`Failed to connect to ${uri.substring(0, 30)}...: ${err.message}`);
    }
  }

  console.error("CRITICAL: All MongoDB connections failed. Express server will run without database features.");
};

module.exports = connectDB;