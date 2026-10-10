import booking from "../config_DB/models/bookingSchema.js";
import list from "../config_DB/models/listingsSchema.js";
import { calculateDays } from "../utils/calculateDays.js"; // for booking check
import { parseCalendarDate } from "../utils/parseCalendarDate.js";
import { daysUntilDate } from "../utils/daysUntilDate.js"; // for cancellation
import ExpressError from "../error.js";

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
      bookingStatus: "CONFIRMED",
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
    const result = await list.findOne({ _id: urlID }).populate("publisher");

    if (!result) {
      sendInfo.status = "Listing doesnt exist";
      return res.status(400).send(sendInfo);
    }
    if (Number(bookingDetails.numberOfGuests) > result.maxGuests) {
      sendInfo.status = `Number of guests cannot exceed ${result.maxGuests}`;
      return res.status(400).json(sendInfo);
    }

    const existingBookings = await booking.find({
      listingID: urlID,
      bookingStatus: "CONFIRMED",
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
      const bookingObj = {};
      bookingObj.ownerName = `${result.publisher.username}`;
      bookingObj.ownerID = `${result.publisher._id}`;
      bookingObj.customerName = req.user?.username;
      bookingObj.customerID = req.user?._id;
      bookingObj.listingID = urlID;
      bookingObj.checkInDate = checkInDate;
      bookingObj.checkOutDate = checkOutDate;
      bookingObj.price = result.Price * days;
      bookingObj.numberOfGuests = bookingDetails.numberOfGuests;
      bookingObj.bookingStatus = "CONFIRMED";

      const bookingSaved = await booking.create(bookingObj);
      if (!bookingSaved) {
        sendInfo.status = "Something is wrong try again later";
        res.status(500).json(sendInfo);
        return;
      }
      sendInfo.status = "Booking successful";
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
        "Cancellation not allowed read the privacy policy accordingly";
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
    const result = await booking.find({ customerID: customerID });

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
    const result = await booking.find({ ownerID: ownerID });
    res.status(200).json(result);
    return;
  } catch (error) {
    console.log(error);
    const newErr = new ExpressError("", 500);
    next(newErr);
  }
};
