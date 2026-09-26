import express from "express";
import { authenticationCheck } from "../customMiddlewares.js";
import { reviewValidation } from "../customMiddlewares.js";
import {
  reviewAdd,
  reviewForm,
  deleteReview,
} from "../controller/reviewControl.js";
const router = express.Router();

// add review db
router.post("/:id/listing", reviewValidation, authenticationCheck, reviewAdd);

//listing review page render
router.get("/new/:id", authenticationCheck, reviewForm);

// delete review
router.delete(
  "/delete/:reviewId/:listingID",
  authenticationCheck,
  deleteReview,
);

export default router;
