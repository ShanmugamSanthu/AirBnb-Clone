import mongoose from "mongoose";

const bookingSchema = mongoose.Schema({
  ownerName: {
    type: String,
    required: true,
  },
  ownerID: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerID: {
    type: String,
    required: true,
  },
  listingID: {
    type: String,
    required: true,
  },
  checkInDate: {
    required: true,
    type: Date,
  },
  checkOutDate: {
    required: true,
    type: Date,
  },
  price: {
    type: Number,
    required: true,
    min: 1,
  },
  bookingStatus: {
    type: String,
    enum: ["CONFIRMED", "CANCELLED"],
    default: "CONFIRMED",
    required: true,
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1,
  },
  cancelledBy: {
    type: String,
    enum: ["CUSTOMER", "OWNER"],
  },
});

const booking = new mongoose.model("booking", bookingSchema);

export default booking;
