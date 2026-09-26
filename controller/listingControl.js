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
  const listingId = req.params.id;
  try {
    const mongoResult = await list.findById({ _id: listingId });
    if (!mongoResult) {
      res.send("Listing not found unable to update");
      return;
    }

    if (req.file) {
      if (!mongoResult.publisher.equals(req.user._id)) {
        const newErr = new ExpressError(
          "You are not the publisher cant update the listing details",
        );
        return next(newErr);
      }
      const result = await cloudinary.uploader.upload(req.file.path);
      const listingObj = req.body.listing;
      listingObj.Image = result.secure_url;
      listingObj.ImagePublicID = result.public_id;

      await list.findByIdAndUpdate(listingId, listingObj, {
        runValidators: true,
      });
      req.flash("success", "Changes Saved");
      res.redirect(`/listing/${listingId}`);
      await cloudinary.uploader.destroy(mongoResult.ImagePublicID);
    } else {
      if (mongoResult.publisher.equals(req.user._id)) {
        await list.findByIdAndUpdate(listingId, req.body.listing, {
          runValidators: true,
        });
        req.flash("success", "Changes Saved");
        return res.redirect(`/listing/${listingId}`);
      }
      const newErr = new ExpressError(
        "You are not the publisher cant update the listing details",
      );
      next(newErr);
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
  const listingId = req.params.id;
  try {
    const result = await list.findById({ _id: listingId });
    if (!result) {
      res.send("Listing not found unable to delete");
      return;
    }
    if (!result.publisher.equals(req.user._id)) {
      const newErr = new ExpressError(
        "Cant delete the listing you are not the publisher",
        500,
      );
      return next(newErr);
    }
    await listingReview.deleteMany({ listingID: listingId });
    await list.findByIdAndDelete(listingId);
    req.flash("success", "Listing deleted successfully");
    res.redirect("/");
    await cloudinary.uploader.destroy(result.ImagePublicID);
    return;
  } catch (err) {
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
