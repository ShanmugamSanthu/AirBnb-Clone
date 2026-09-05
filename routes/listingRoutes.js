import express from "express";
import mongoose from "mongoose";
import listingReview from "../config_DB/models/listingReviewSchema.js";
import list from "../config_DB/models/listingsSchema.js";
import reviewSchema from "../serverSchemaReview.js";
import listingsSchema from "../serverSchema.js";

const router = express.Router();
//validation middleware edit and new listings
const listingValidation = (req, res, next) => {
  const { error } = listingsSchema.validate(req.body.listing);
  if (error) {
    return res.render("Error", { error }); // separte error page
  }
  next();
};

// review validation middleware
const reviewValidation = (req, res, next) => {
  const { error1 } = reviewSchema.validate(req.body.listingReview);
  if (error1) {
    return res.render("Error", { error1, error: null, reviewError: null });
  } else {
    next();
  }
};

// render listing form
router.get("/new", (req, res) => {
  res.render("addListing", { error: null, listingData: null });
});

// add new listing to DB
router.post("/new/add", listingValidation, async (req, res) => {
  try {
    await list.create(req.body.listing);
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.send("Couldnt add the listing try later");
  }
});

//edit page render
router.get("/edit/:id", async (req, res) => {
  const listingid = req.params.id;
  const listingData = await list.findById(listingid);
  res.render("editForm", { listingData, error: null });
});

//save edited listing form
router.patch("/edit/update/:id", listingValidation, async (req, res) => {
  const objID = req.params.id;
  try {
    await list.findByIdAndUpdate(objID, req.body.listing, {
      runValidators: true,
    });
    res.redirect(`/listing/${objID}`);
  } catch (err) {
    console.log(err);
    res.send("Try again later");
  }
});

//listing review page render
router.get("/review/new/:id", (req, res) => {
  let listingID = req.params.id;
  res.render("newReview", { listingID });
});

//listing delete route
router.delete("/delete/:id", async (req, res) => {
  const userID = req.params.id;
  try {
    await listingReview.deleteMany({ listingID: userID });
    await list.findByIdAndDelete(userID);
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.send("Try again later");
  }
});

//review from db to client
const getReviews = async (userID) => {
  return await listingReview.find({ listingID: userID });
};

// add review db
router.post("/review/:id", reviewValidation, async (req, res) => {
  const reviewData = req.body.listingReview;
  try {
    await listingReview.create(reviewData);
    return res.redirect(`/listing/${req.params.id}`);
  } catch (reviewError) {
    console.log(reviewError);
    res.render("Error", { reviewError, error: null });
  }
});

//get listing by id
router.get("/:id", async (req, res) => {
  const userID = req.params.id;
  if (!mongoose.isValidObjectId(userID)) {
    res.status(400).render("Error", {
      invalidID,
      error: null,
      reviewError: null,
      error1: ull,
    });
    return;
  }
  const listingData = await list.findById(userID);
  if (!listingData) {
    res.status(400).render("Error", {
      idNotFound,
      invalidID: null,
      error: null,
      reviewError: null,
      error1: ull,
    });
    return;
  }
  const reviewData = await getReviews(userID);
  res.render("displayid", { listingData, reviewData });
});

export default router;
