import "dotenv/config";
import mongoose from "mongoose";
const connectDB = async function () {
  await mongoose.connect(process.env.MONGO_URL);
};

export default connectDB;
