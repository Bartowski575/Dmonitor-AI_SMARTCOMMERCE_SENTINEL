const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://swethan305:SIi1aueyVgE61IyV@cluster0.isyslnp.mongodb.net/dmonitor?retryWrites=true&w=majority&appName=Cluster0");
    console.log(`MongoDB Connected : ${connection.connection.host}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
