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
  },
  { timestamps: true },
);

const listingReview = mongoose.model("review", reviewSchema);

export default listingReview;
