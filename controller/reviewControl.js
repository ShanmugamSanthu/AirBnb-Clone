import listingReview from "../config_DB/models/listingReviewSchema.js";
import ExpressError from "../error.js";
// add review db
export const reviewAdd = async (req, res, next) => {
  const reviewData = req.body.listingReview;
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
      res.status(400).send("Review not found unable to delete");
      return;
    }
    if (!result.author.equals(req.user._id)) {
      const newErr = new ExpressError(
        "Cant delete the review your are not the publisher",
        500,
      );
      return next(newErr);
    }

    await listingReview.findByIdAndDelete(reviewID);
    req.flash("success", "Review deleted successfully");
    res.redirect(`/listing/${listingID}`);
  } catch (deleteReviewError) {
    console.log(deleteReviewError);
    const newErr = new ExpressError("Couldnt delete the review", 500);
    next(newErr);
  }
};
