import ExpressError from "../error.js";
import list from "../config_DB/models/listingsSchema.js";
import mongoose from "mongoose";
import listingReview from "../config_DB/models/listingReviewSchema.js";
import cloudinary from "../config_DB/cloudinary.js";
import { unlink } from "node:fs/promises";

// render listing form
export const listingForm = (req, res) => {
  res.json("addListing");
};

// add new listing to DB
export const addListing = async (req, res, next) => {
  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      await list.create({
        ...req.body.listing,
        publisher: req.user._id,
        Image: result.secure_url,
        ImagePublicID: result.public_id,
      });
      res.redirect("/");
    } else {
      await list.create({
        ...req.body.listing,
        publisher: req.user._id,
      });
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    const newErr = new ExpressError("", 500);
    next(newErr);
  } finally {
    try {
      if (req.file?.path) {
        await unlink(req.file.path);
      }
    } catch (err) {
      console.log(err); // dev production error so no user interference
    }
  }
};

//edit page render
export const editForm = async (req, res, next) => {
  try {
    const listingid = req.params.id;
    const listingData = await list.findById(listingid);
    res.json({ listingData });
  } catch (err) {
    console.log(err);
    const newErr = new ExpressError("", 500);
    next(newErr);
  }
};

//save edited listing form
export const saveListingChanges = async (req, res, next) => {
  const listingId = req.params.id;
  try {
    const mongoResult = await list.findById({ _id: listingId });
    if (!mongoResult) {
      console.log("Listing not found unable to update");
      res.redirect("/");
      return;
    }

    if (req.file) {
      if (!mongoResult.publisher.equals(req.user._id)) {
        console.log(
          "You are not the publisher cant update the listing details",
        );
        res.redirect("/");
        return;
      }
      const result = await cloudinary.uploader.upload(req.file.path);
      const listingObj = req.body.listing;
      listingObj.Image = result.secure_url;
      listingObj.ImagePublicID = result.public_id;

      await list.findByIdAndUpdate(listingId, listingObj, {
        runValidators: true,
      });

      res.status(200).send();
      if (mongoResult.ImagePublicID) {
        await cloudinary.uploader
          .destroy(mongoResult.ImagePublicID)
          .catch((err) => {
            console.log(err);
          });
        return null;
      }
    } else {
      if (mongoResult.publisher.equals(req.user._id)) {
        await list.findByIdAndUpdate(listingId, req.body.listing, {
          runValidators: true,
        });

        return res.status(200).send();
      }
      console.log("You are not the publisher cant update the listing details");
      res.redirect("/");
      return;
    }
  } catch (err) {
    console.log(err);
    const newErr = new ExpressError("", 500);
    next(newErr);
  } finally {
    try {
      if (req.file?.path) {
        await unlink(req.file.path);
      }
    } catch (err) {
      console.log(err); // dev production error so no user interference
    }
  }
};

//listing delete route
export const deleteListing = async (req, res, next) => {
  const listingId = req.params.id;
  try {
    const result = await list.findById({ _id: listingId });
    if (!result) {
      res.redirect("/");
      return;
    }
    if (!result.publisher.equals(req.user._id)) {
      res.redirect("/");
      return;
    }

    await listingReview.deleteMany({ listingID: listingId });
    await list.findByIdAndDelete(listingId);

    res.status(200).json("Listing deleted successfully");
    if (result.ImagePublicID) {
      await cloudinary.uploader.destroy(result.ImagePublicID).catch((err) => {
        console.log(err);
      });
      return null;
    }
    return;
  } catch (err) {
    console.log(err);
    const newErr = new ExpressError("", 500);
    next(newErr);
  }
};

//review from db to client
const getReviews = async (userID) => {
  try {
    return await listingReview.find({ listingID: userID }).populate("author");
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//get listing by id
export const ListingByID = async (req, res, next) => {
  const userID = req.params.id;
  if (!mongoose.isValidObjectId(userID)) {
    res.redirect("/");
    return;
  }
  try {
    const listingData = await list.findById(userID).populate("publisher");
    if (!listingData) {
      res.redirect("/");
      return;
    }

    const reviewData = await getReviews(userID);
    res.json({ listingData, reviewData });
  } catch (err) {
    console.log(err);
    const newErr = new ExpressError("", 500);
    next(newErr);
  }
};
