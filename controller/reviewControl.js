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
    return res.redirect(`/listing/${req.params.id}`);
  } catch (reviewError) {
    console.log(reviewError);
    const newErr = new ExpressError("", 500);
    next(newErr);
  }
};

//listing review page render
export const reviewForm = (req, res) => {
  let listingID = req.params.id;
  res.json({ listingID });
};

// delete review
export const deleteReview = async (req, res, next) => {
  const reviewID = req.params.reviewId;
  const listingID = req.params.listingID;
  try {
    const result = await listingReview.findById({ _id: reviewID });
    if (!result) {
      res.redirect("/");

      return;
    }
    if (!result.author.equals(req.user._id)) {
      res.redirect("/");

      return;
    }

    await listingReview.findByIdAndDelete(reviewID);

    res.redirect(`/listing/${listingID}`);
  } catch (deleteReviewError) {
    console.log(deleteReviewError);
    const newErr = new ExpressError("", 500);
    next(newErr);
  }
};
