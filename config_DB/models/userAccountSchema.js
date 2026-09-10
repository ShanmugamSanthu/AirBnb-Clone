import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userAccountSchema = new mongoose.Schema({
  userEmail: {
    required: true,
    trim: true,
    type: String,
    lowercase: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
});

userAccountSchema.plugin(passportLocalMongoose.default);

const userAccount = mongoose.model("user", userAccountSchema);

export default userAccount;
