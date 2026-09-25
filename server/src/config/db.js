const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`[MongoDB] Atlas Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`[MongoDB] Atlas Connection Error: ${error.message}`);
    // We don't exit process so app remains alive and reports DB status
    return false;
  }
};

module.exports = connectDB;
