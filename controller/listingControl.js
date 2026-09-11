import ExpressError from "../error.js";
import list from "../config_DB/models/listingsSchema.js";
import mongoose from "mongoose";
import listingReview from "../config_DB/models/listingReviewSchema.js";
import cloudinary from "../config_DB/cloudinary.js";

// render listing form
export const listingForm = (req, res) => {
  res.render("addListing");
};

// add new listing to DB
export const addListing = async (req, res, next) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    await list.create({
      ...req.body.listing,
      publisher: req.user._id,
      Image: result.secure_url,
      ImagePublicID: result.public_id,
    });
    req.flash("success", "Listing created successfully");
    res.redirect("/");
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//edit page render
export const editForm = async (req, res) => {
  const listingid = req.params.id;
  const listingData = await list.findById(listingid);
  res.render("editForm", { listingData, error: null });
};

//save edited listing form
export const saveListingChanges = async (req, res, next) => {
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
};

//listing delete route
export const deleteListing = async (req, res, next) => {
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
};

//review from db to client
const getReviews = async (userID) => {
  return await listingReview.find({ listingID: userID }).populate("author");
};

//get listing by id
export const ListingByID = async (req, res, next) => {
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
};
