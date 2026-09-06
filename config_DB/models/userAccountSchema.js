import mongoose from "mongoose";

const userAccountSchema = new mongoose.Schema({
  userEmail: {
    required: true,
    trim: true,
    type: String,
    lowercase: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  userPassword: {
    required: true,
    minlength: 5,
    type: String,
  },
  userName: {
    required: true,
    type: String,
    trim: true,
    minlength: 2,
  },
});

const userAccount = mongoose.model("user", userAccountSchema);

export default userAccount;
