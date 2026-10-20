
import booking from "../config_DB/models/bookingSchema.js";

const statusCheck = async (bookingsStatus) => {
    const now = new Date();

    for (const bookingData of bookingsStatus) {
        let newStatus = bookingData.bookingStatus;

        if (
            bookingData.bookingStatus === "CONFIRMED" ||
            bookingData.bookingStatus === "ONGOING"
        ) {
            if (now >= bookingData.checkOutDate) {
                newStatus = "COMPLETED";
            } else if (now >= bookingData.checkInDate) {
                newStatus = "ONGOING";
            }
        }

        if (newStatus !== bookingData.bookingStatus) {
            await booking.findByIdAndUpdate(
                bookingData._id,
                { bookingStatus: newStatus }
            );

            bookingData.bookingStatus = newStatus;
        }
    }

    return bookingsStatus;
};

export default statusCheck;
