import express from "express";
import mongoose from "mongoose";
import listingReview from "../config_DB/models/listingReviewSchema.js";
import list from "../config_DB/models/listingsSchema.js";
import {
  authorizationCheck,
  listingValidation,
} from "../customMiddlewares.js  ";

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
  async (req, res) => {
    try {
      await list.create({ ...req.body.listing, publisher: req.session.userID });
      res.redirect("/");
    } catch (err) {
      console.log(err);
      res.send("Couldnt add the listing try later");
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
  async (req, res) => {
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
  },
);

//listing delete route
router.delete("/delete/:id", authorizationCheck, async (req, res) => {
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
  return await listingReview.find({ listingID: userID }).populate("author");
};

//get listing by id
router.get("/:id", authorizationCheck, async (req, res) => {
  const userID = req.params.id;
  if (!mongoose.isValidObjectId(userID)) {
    res.status(400).render("Error", {
      invalidID,
      error: null,
      reviewError: null,
      error1: null,
    });
    return;
  }
  const listingData = await list.findById(userID).populate("publisher");
  if (!listingData) {
    res.status(400).render("Error", {
      idNotFound,
      invalidID: null,
      error: null,
      reviewError: null,
      error1: null,
    });
    return;
  }
  const reviewData = await getReviews(userID);
  res.render("displayid", { listingData, reviewData });
});

export default router;
