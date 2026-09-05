import express from "express";
import listingReview from "../config_DB/models/listingReviewSchema.js";
const router = express.Router();

// delete review
router.post("/delete/:reviewId/:listingID", async (req, res) => {
  const reviewID = req.params.reviewId;
  const listingID = req.params.listingID;
  try {
    await listingReview.findByIdAndDelete(reviewID);
    res.redirect(`/listing/${listingID}`);
  } catch (deleteReviewError) {
    console.log(deleteReviewError);
    res.render("Error", { deleteReviewError, error: null, reviewError: null });
  }
});

export default router;
