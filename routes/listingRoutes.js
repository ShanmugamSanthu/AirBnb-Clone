import express from "express";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

import {
  authorizationCheck,
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
router.get("/new", authorizationCheck, listingForm);

// add new listing to DB
router.post(
  "/new/add",
  authorizationCheck,
  upload.single("listing[Image]"),
  listingValidation,
  addListing,
);

//edit page render
router.get("/edit/:id", authorizationCheck, editForm);

//save edited listing form
router.patch(
  "/edit/update/:id",
  authorizationCheck,
  listingValidation,
  saveListingChanges,
);

//listing delete route
router.delete("/delete/:id", authorizationCheck, deleteListing);

//get listing by id
router.get("/:id", authorizationCheck, ListingByID);

export default router;
