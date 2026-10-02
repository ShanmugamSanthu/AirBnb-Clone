import booking from "../config_DB/models/bookingSchema.js";
import list from "../config_DB/models/listingsSchema.js";
import { calculateDays } from "../utils/calculateDays.js"; // for booking check
import { parseCalendarDate } from "../utils/parseCalendarDate.js";
import { daysUntilDate } from "../utils/daysUntilDate.js"; // for cancellation

// shall import booking severSchemaBookings later with joi cuz not built yet

// check booking availabilty and save or not save
export const addBooking = async (req, res) => {
  const bookingDetails = req.body;
  console.log(bookingDetails);
  const checkInDate = parseCalendarDate(bookingDetails.checkInDate);
  const checkOutDate = parseCalendarDate(bookingDetails.checkOutDate);

  const days = calculateDays(checkOutDate, checkInDate);
  const urlID = req.params.id;
  const result = await list.findOne({ _id: urlID }).populate("publisher");

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
    bookingObj.customerName = null; // replace with req.user later
    bookingObj.customerID = null;
    bookingObj.listingID = urlID;
    bookingObj.checkInDate = checkInDate;
    bookingObj.checkOutDate = checkOutDate;
    bookingObj.price = result.Price * days;
    bookingObj.numberOfGuests = bookingDetails.numberOfGuests;
    bookingObj.bookingStatus = "CONFIRMED";

    const bookingSaved = await booking.create(bookingObj);
    if (!bookingSaved) {
      console.log("Something is wrong");
      return;
    }

    console.log("Booking successful");
  } else {
    console.log("Booking not available");
  }

  res.send("Data received");
};

// check booking cancellation and update accordingly
export const cancelBooking = async (req, res) => {
  const bookingID = req.params.id;
  const existingBookings = await booking.findOne({
    _id: bookingID,
    bookingStatus: "CONFIRMED",
  });

  if (!existingBookings) {
    console.log("Booking doesnt exist and cannot be cancelled");
    return;
  }

  const result = daysUntilDate(existingBookings.checkInDate);

  if (result < 7) {
    console.log("Fuck off ");
    return;
  }

  console.log("Cancellation allowed");

  existingBookings.bookingStatus = "CANCELLED";
  await existingBookings.save();

  console.log("Booking cancelled");
  res.send("Booking cancelled successfully");
};
