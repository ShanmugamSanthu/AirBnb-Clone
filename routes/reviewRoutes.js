import express from "express";
import { authorizationCheck } from "../customMiddlewares.js";
import { reviewValidation } from "../customMiddlewares.js";
import {
  reviewAdd,
  reviewForm,
  deleteReview,
} from "../controller/reviewControl.js";
const router = express.Router();

// add review db
router.post("/:id/listing", reviewValidation, authorizationCheck, reviewAdd);

//listing review page render
router.get("/new/:id", authorizationCheck, reviewForm);

// delete review
router.delete("/delete/:reviewId/:listingID", authorizationCheck, deleteReview);

export default router;
