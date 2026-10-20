import booking from "../config_DB/models/bookingSchema.js";
import list from "../config_DB/models/listingsSchema.js";
import { calculateDays } from "../utils/calculateDays.js"; // for booking check
import { parseCalendarDate } from "../utils/parseCalendarDate.js";
import { daysUntilDate } from "../utils/daysUntilDate.js"; // for cancellation
import ExpressError from "../error.js";
import statusCheck from "../utils/boookingStatusUpdate.js";
import mongoose from "mongoose";

// check booking availabilty
export const checkBooking = async (req, res, next) => {
  const bookingDetails = req.query;

  const sendInfo = {};

  const checkInDate = parseCalendarDate(bookingDetails.checkInDate);
  const checkOutDate = parseCalendarDate(bookingDetails.checkOutDate);

  const today = new Date();

  const todayUTC = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
  );

  if (checkInDate < todayUTC) {
    sendInfo.status = "Check-in date cannot be before today";
    return res.status(400).json(sendInfo);
  }

  if (checkOutDate < checkInDate) {
    sendInfo.status = "Check-out date must be on or after check-in date";
    return res.status(400).json(sendInfo);
  }

  const days = calculateDays(checkOutDate, checkInDate);

  const urlID = req.params.id;
  try {
    const listingExists = await list.findById(urlID);
    if (!listingExists) {
      sendInfo.status = "Listing doesnt exist";
      return res.status(400).send(sendInfo);
    }
    const existingBookings = await booking.find({
      listingID: urlID,
      bookingStatus: { $in: ["CONFIRMED", "ONGOING"] },
    });

    let isAvailable = true;
    for (const existingBooking of existingBookings) {
      if (
        (checkInDate >= existingBooking.checkInDate &&
          checkInDate <= existingBooking.checkOutDate) ||
        (checkOutDate >= existingBooking.checkInDate &&
          checkOutDate <= existingBooking.checkOutDate)
      ) {
        isAvailable = false;
        break;
      } else if (
        (existingBooking.checkInDate >= checkInDate &&
          existingBooking.checkInDate <= checkOutDate) ||
        (existingBooking.checkOutDate >= checkInDate &&
          existingBooking.checkOutDate <= checkOutDate)
      ) {
        isAvailable = false;
        break;
      }
    }
    if (isAvailable) {
      sendInfo.bookedPrice = days * listingExists.Price;
      sendInfo.status = "Booking available";
      res.status(200).json(sendInfo);
      return;
    } else {
      sendInfo.status = "Booking not available";
      res.status(200).json(sendInfo);
      return;
    }
  } catch (error) {
    console.log(error);
    const newErr = new ExpressError("", 500);
    next(newErr);
  }
};

// check booking availabilty and save
export const addBooking = async (req, res, next) => {
  const bookingDetails = req.body;
  const sendInfo = {};

  const checkInDate = parseCalendarDate(bookingDetails.checkInDate);
  const checkOutDate = parseCalendarDate(bookingDetails.checkOutDate);

  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate()
    )
  );

  if (checkInDate < todayUTC) {
    return res.status(400).json({
      status: "Check-in date cannot be before today",
    });
  }

  if (checkOutDate <= checkInDate) {
    return res.status(400).json({
      status: "Check-out date must be after check-in date",
    });
  }

  const numberOfGuests = Number(bookingDetails.numberOfGuests);

  if (!Number.isInteger(numberOfGuests) || numberOfGuests < 1) {
    return res.status(400).json({
      status: "Please enter a valid number of guests",
    });
  }

  const days = calculateDays(checkOutDate, checkInDate);
  const urlID = req.params.id;

  let session;

  try {
    session = await mongoose.startSession();

    let transactionResult;

    await session.withTransaction(
      async () => {

        transactionResult = null;

        const lockResult = await list.updateOne(
          { _id: urlID },
          { $inc: { bookingLockVersion: 1 } },
          { session }
        );

        if (lockResult.matchedCount === 0) {
          transactionResult = { type: "missing-listing" };
          return;
        }


        const result = await list
          .findById(urlID)
          .populate("publisher")
          .session(session);

        if (!result) {
          transactionResult = { type: "missing-listing" };
          return;
        }

        if (numberOfGuests > result.maxGuests) {
          transactionResult = {
            type: "invalid-guests",
            maxGuests: result.maxGuests,
          };
          return;
        }


        const existingBooking = await booking.findOne({
          listingID: urlID,
          bookingStatus: { $in: ["CONFIRMED", "ONGOING"] },
          checkInDate: { $lt: checkOutDate },
          checkOutDate: { $gt: checkInDate },
        }).session(session);

        if (existingBooking) {
          transactionResult = { type: "unavailable" };
          return;
        }

        const bookingObj = {
          ownerName: result.publisher.username,
          ownerID: String(result.publisher._id),
          customerName: req.user?.username,
          customerID: String(req.user?._id),
          listingID: urlID,
          checkInDate,
          checkOutDate,
          price: result.Price * days,
          numberOfGuests,
          bookingStatus: "CONFIRMED",
        };

        await booking.create([bookingObj], { session });

        transactionResult = { type: "success" };
      },
      {
        readPreference: "primary",
        readConcern: { level: "snapshot" },
        writeConcern: { w: "majority" },
      }
    );

    if (transactionResult?.type === "missing-listing") {
      return res.status(404).json({
        status: "Listing doesnt exist",
      });
    }

    if (transactionResult?.type === "invalid-guests") {
      return res.status(400).json({
        status: `Number of guests cannot exceed ${transactionResult.maxGuests}`,
      });
    }

    if (transactionResult?.type === "unavailable") {
      return res.status(409).json({
        status: "Booking not available",
      });
    }

    if (transactionResult?.type === "success") {
      return res.status(200).json({
        status: "Booking successful",
      });
    }

    throw new Error("Booking transaction completed without a result");
  } catch (error) {
    console.error("Booking transaction failed:", error);

    if (res.headersSent) {
      return next(error);
    }

    const newErr = new ExpressError(
      "Unable to complete booking. Please try again.",
      500
    );

    next(newErr);
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};

// check booking cancellation and update accordingly
export const cancelBooking = async (req, res, next) => {
  const bookingID = req.params.id;
  const sendInfo = {};

  try {
    const existingBookings = await booking.findOne({
      _id: bookingID,
      bookingStatus: "CONFIRMED",
      $or: [{ customerID: req.user._id }, { ownerID: req.user._id }],
    });

    if (!existingBookings) {
      sendInfo.status = "Booking doesnt exist and cannot be cancelled";
      res.status(400).json(sendInfo);
      return;
    }

    const result = daysUntilDate(existingBookings.checkInDate);

    if (result < 7) {
      sendInfo.status =
        "Cancellation not allowed read the cancellation policy accordingly";
      res.status(400).json(sendInfo);
      return;
    }

    if (existingBookings.customerID.toString() === req.user._id.toString()) {
      existingBookings.cancelledBy = "CUSTOMER";
    } else if (
      existingBookings.ownerID.toString() === req.user._id.toString()
    ) {
      existingBookings.cancelledBy = "OWNER";
    }

    existingBookings.bookingStatus = "CANCELLED";
    await existingBookings.save();

    sendInfo.status = "Booking cancelled successfully";
    res.status(200).json(sendInfo);
  } catch (err) {
    console.log(err);
    const newErr = new ExpressError("", 500);
    next(newErr);
  }
};

//get myBookings data
export const myBookings = async (req, res, next) => {
  const customerID = req.user?._id;
  try {
    let result = await booking.find({ customerID: customerID });
    result = await statusCheck(result)
    res.status(200).json(result);
    return;
  } catch (error) {
    console.log(error);
    const newErr = new ExpressError("", 500);
    next(newErr);
  }
};

//get manageBookings data
export const manageBookings = async (req, res, next) => {
  const ownerID = req.user?._id;
  try {
    let result = await booking.find({ ownerID: ownerID });
    result = await statusCheck(result)
    res.status(200).json(result);
    return;
  } catch (error) {
    console.log(error);
    const newErr = new ExpressError("", 500);
    next(newErr);
  }
};
















