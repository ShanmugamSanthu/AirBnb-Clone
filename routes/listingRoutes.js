import express from "express";
import mongoose from "mongoose";
import listingReview from "../config_DB/models/listingReviewSchema.js";
import list from "../config_DB/models/listingsSchema.js";
import {
  authorizationCheck,
  listingValidation,
} from "../customMiddlewares.js  ";
import ExpressError from "../error.js";

const router = express.Router();

// render listing form
router.get("/new", authorizationCheck, (req, res) => {
  res.render("addListing", { error: null, listingData: null });
});

// add new listing to DB
router.post(
  "/new/add",
  authorizationCheck,
  listingValidation,
  async (req, res, next) => {
    try {
      await list.create({ ...req.body.listing, publisher: req.user._id });
      req.flash("success", "Listing created successfully");
      res.redirect("/");
    } catch (err) {
      console.log(err);
      const newErr = new ExpressError(
        "Couldnt add listing try again later",
        500,
      );
      next(newErr);
    }
  },
);

//edit page render
router.get("/edit/:id", authorizationCheck, async (req, res) => {
  const listingid = req.params.id;
  const listingData = await list.findById(listingid);
  res.render("editForm", { listingData, error: null });
});

//save edited listing form
router.patch(
  "/edit/update/:id",
  authorizationCheck,
  listingValidation,
  async (req, res, next) => {
    const userID = req.params.id;
    try {
      const result = await list.findById({ _id: userID });
      if (!result) {
        res.send("Listing not found unable to update");
        return;
      }
      if (result.publisher.equals(req.user._id)) {
        await list.findByIdAndUpdate(userID, req.body.listing, {
          runValidators: true,
        });
        req.flash("success", "Changes Saved");
        res.redirect(`/listing/${userID}`);
      } else {
        res.send("Cant update the listing you are not the publisher");
      }
    } catch (err) {
      console.log(err);
      const newErr = new ExpressError(
        "Couldnt save changes try again later",
        500,
      );
      next(newErr);
    }
  },
);

//listing delete route
router.delete("/delete/:id", authorizationCheck, async (req, res, next) => {
  const userID = req.params.id;
  try {
    const result = await list.findById({ _id: userID });
    if (!result) {
      res.send("Listing not found unable to delete");
      return;
    }
    if (result.publisher.equals(req.user._id)) {
      await listingReview.deleteMany({ listingID: userID });
      await list.findByIdAndDelete(userID);
      req.flash("success", "Listing deleted successfully");
      res.redirect("/");
    } else {
      res.send("Cant delete the listing you are not the publisher");
    }
  } catch (err) {
    console.log(err);
    const newErr = new ExpressError(
      "Couldnt delete listing try again later",
      500,
    );
    next(newErr);
  }
});

//review from db to client
const getReviews = async (userID) => {
  return await listingReview.find({ listingID: userID }).populate("author");
};

//get listing by id
router.get("/:id", authorizationCheck, async (req, res, next) => {
  const userID = req.params.id;
  if (!mongoose.isValidObjectId(userID)) {
    const newErr = new ExpressError("Listing id provided is incorrect", 400);
    next(newErr);
    return;
  }
  const listingData = await list.findById(userID).populate("publisher");
  if (!listingData) {
    const newErr = new ExpressError("Couldnt find the listing", 500);
    next(newErr);
    return;
  }
  const reviewData = await getReviews(userID);
  res.render("displayid", { listingData, reviewData });
});

export default router;
