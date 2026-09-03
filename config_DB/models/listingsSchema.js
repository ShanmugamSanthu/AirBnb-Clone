import mongoose from "mongoose";

const defineSchema = mongoose.Schema;

const listingsSchema = new defineSchema({
  Title: {
    required: true,
    type: String,
    minlength: 1,
    maxlength: 25,
    trim: true,
  },
  Description: {
    required: true,
    type: String,
    minlength: 1,
    maxlength: 100,
    trim: true,
  },
  Image: {
    type: String,
    default: "/images/no_image_listings.jpg",
    set: (v) => (v === "" ? "/images/no_image_listings.jpg" : v),
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
});

const list = mongoose.model("listing", listingsSchema);

export default list;
