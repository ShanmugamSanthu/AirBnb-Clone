import mongoose from "mongoose";

const defineSchema = mongoose.Schema;

const listingsSchema = new defineSchema({
  Title: {
    required: true,
    type: String,
    minlength: 1,
    maxlength: 200,
    trim: true,
  },
  Description: {
    required: true,
    type: String,
    minlength: 1,
    maxlength: 200,
    trim: true,
  },
  Image: {
    type: String,
    default: "/images/no_image_listings.jpg",
    set: (v) => (v === "" ? "/images/no_image_listings.jpg" : v),
  },
  ImagePublicID: {
    type: String,
  },
  Price: {
    required: true,
    type: Number,
    min: 1,
  },
  Location: {
    required: true,
    type: String,
    minlength: 1,
    maxlength: 15,
    trim: true,
  },
  Country: {
    required: true,
    type: String,
    minlength: 1,
    maxlength: 15,
    trim: true,
  },
  publisher: {
    ref: "user",
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const list = mongoose.model("listing", listingsSchema);

export default list;
