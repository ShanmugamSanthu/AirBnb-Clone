import "dotenv/config";
import mongoose from "mongoose";
import dns from "node:dns"

dns.setServers(["8.8.8.8"]);

const connectDB = async function () {
  await mongoose.connect(process.env.MONGO_URI);
};

export default connectDB;
