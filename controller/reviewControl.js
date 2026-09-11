import listingReview from "../config_DB/models/listingReviewSchema.js";
import ExpressError from "../error.js";
// add review db
export const reviewAdd = async (req, res, next) => {
  const reviewData = req.body.listingReview;
  console.log(reviewData);
  try {
    await listingReview.create({
      ...reviewData,
      author: req.user._id,
    });
    req.flash("success", "Review posted");
    return res.redirect(`/listing/${req.params.id}`);
  } catch (reviewError) {
    console.log(reviewError);
    const newErr = new ExpressError("Review couldnt be posted", 500);
    next(newErr);
  }
};

//listing review page render
export const reviewForm = (req, res) => {
  let listingID = req.params.id;
  res.render("newReview", { listingID });
};

// delete review
export const deleteReview = async (req, res, next) => {
  const reviewID = req.params.reviewId;
  const listingID = req.params.listingID;
  try {
    const result = await listingReview.findById({ _id: reviewID });
    if (!result) {
      res.send("Review not found unable to delete").status(400);
      return;
    }
    if (result.author.equals(req.user._id)) {
      await listingReview.findByIdAndDelete(reviewID);
      req.flash("success", "Review deleted successfully");
      res.redirect(`/listing/${listingID}`);
    } else {
      res.send("Cannot delete review you are not the author");
    }
  } catch (deleteReviewError) {
    console.log(deleteReviewError);
    const newErr = new ExpressError("Couldnt delete the review", 500);
    next(newErr);
  }
};
