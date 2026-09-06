import express from "express";
import listingReview from "../config_DB/models/listingReviewSchema.js";
import { authorizationCheck } from "../customMiddlewares.js";
import { reviewValidation } from "../customMiddlewares.js";

const router = express.Router();

// add review db
router.post(
  "/:id/listing",
  reviewValidation,
  authorizationCheck,
  async (req, res) => {
    const reviewData = req.body.listingReview;
    try {
      await listingReview.create({
        ...reviewData,
        author: req.session.userID,
      });
      return res.redirect(`/listing/${req.params.id}`);
    } catch (reviewError) {
      console.log(reviewError);
      res.render("Error", {
        reviewError,
        error: null,
        error1: null,
        invalidID: null,
        idNotFound: null,
        userError: null,
      });
    }
  },
);
//listing review page render
router.get("/new/:id", authorizationCheck, (req, res) => {
  let listingID = req.params.id;
  res.render("newReview", { listingID });
});

// delete review
router.post(
  "/delete/:reviewId/:listingID",
  authorizationCheck,
  async (req, res) => {
    const reviewID = req.params.reviewId;
    const listingID = req.params.listingID;
    try {
      await listingReview.findByIdAndDelete(reviewID);
      res.redirect(`/listing/${listingID}`);
    } catch (deleteReviewError) {
      console.log(deleteReviewError);
      res.render("Error", {
        deleteReviewError,
        error: null,
        reviewError: null,
      });
    }
  },
);

export default router;
