import mongoose from "mongoose";

const defineSchema = mongoose.Schema;

const listingsSchema = new defineSchema({
  Title: {
    required: true,
    type: String,
  },
  Description: {
    required: true,
    type: String,
  },
  Image: {
    type: String,
    default: "/images/no_image_listings.jpg",
    set: (v) => (v === "" ? "/images/no_image_listings.jpg" : v),
  },
  Price: {
    required: true,
    type: Number,
  },
  Location: {
    required: true,
    type: String,
  },
  Country: {
    required: true,
    type: String,
  },
});

const list = mongoose.model("listing", listingsSchema);

export default list;
