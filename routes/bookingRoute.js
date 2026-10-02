import express from "express";
import {
  addBooking,
  cancelBooking,
  checkBooking,
  myBookings,
  manageBookings,
} from "../controller/bookingControl.js";
import {
  authenticationCheck,
  bookingGetValidation,
  bookingPostValidation,
} from "../customMiddlewares.js";

const router = express.Router();

router.get("/mybookings", authenticationCheck, myBookings); // temp name
router.get("/managebookings", authenticationCheck, manageBookings); // temp name

router.get("/:id", authenticationCheck, bookingGetValidation, checkBooking);
router.post("/:id", authenticationCheck, bookingPostValidation, addBooking);

router.delete("/:id", authenticationCheck, cancelBooking);

export default router;
