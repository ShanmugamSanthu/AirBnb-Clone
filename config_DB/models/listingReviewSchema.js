import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    listingComment: {
      type: String,
    },
    listingRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    listingID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "listing",
    },
    author: {
      ref: "user",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true },
);

const listingReview = mongoose.model("review", reviewSchema);

export default listingReview;
