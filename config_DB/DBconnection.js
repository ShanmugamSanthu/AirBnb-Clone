import mongoose from "mongoose";

const connectDB = async function () {
  await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");
};

export default connectDB;
