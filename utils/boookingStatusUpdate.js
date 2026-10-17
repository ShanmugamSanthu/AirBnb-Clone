import booking from "../config_DB/models/bookingSchema.js";

const statusCheck = async (bookingsStatus) => {
    const now = new Date();

    for (const bookingData of bookingsStatus) {
        // Never change cancelled or already processed bookings
        if (bookingData.bookingStatus !== "CONFIRMED") {
            continue;
        }

        let newStatus = "CONFIRMED";


        if (now >= bookingData.checkOutDate) {
            newStatus = "COMPLETED";
        }

        else if (now >= bookingData.checkInDate) {
            newStatus = "ONGOING";
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
