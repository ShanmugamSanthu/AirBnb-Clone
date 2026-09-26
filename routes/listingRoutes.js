import express from "express";

import {
  authenticationCheck,
  listingValidation,
} from "../customMiddlewares.js  ";
import {
  listingForm,
  addListing,
  editForm,
  saveListingChanges,
  deleteListing,
  ListingByID,
} from "../controller/listingControl.js";

const router = express.Router();

// render listing form
router.get("/new", authenticationCheck, listingForm);

// add new listing to DB
router.post(
  "/new/add",
  authenticationCheck,
  upload.single("listing[Image]"),
  listingValidation,
  addListing,
);

//edit page render
router.get("/edit/:id", authenticationCheck, editForm);

//save edited listing form
router.patch(
  "/edit/update/:id",
  authenticationCheck,
  upload.single("listing[Image]"),
  listingValidation,
  saveListingChanges,
);

//listing delete route
router.delete("/delete/:id", authenticationCheck, deleteListing);

//get listing by id
router.get("/:id", authenticationCheck, ListingByID);

export default router;
