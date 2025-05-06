const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/TOPS_DB");
    console.log("MongoDB connected");
  } catch (err) {
    console.error("DB connection failed..!", err);
  }
};

module.exports = connectDB;
