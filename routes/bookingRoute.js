import express from "express";
import { addBooking, cancelBooking } from "../controller/bookingControl.js";

const router = express.Router();

router.post("/:id", /*Auth middlewares*/ addBooking);

router.delete("/:id" /*Auth middlewares*/, cancelBooking);

export default router;
