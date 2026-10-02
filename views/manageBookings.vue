<script setup>
import { onMounted, ref } from "vue";

const userBookings = ref([]);
const info = ref("");

const runFn = async () => {
  const response = await fetch("/vue/booking/managebookings", {
    method: "GET",
  });

  if (response.status === 500) {
    info.value = "Something is wrong try again later";
    return;
  }
  const data = await response.json();

  userBookings.value = data;
  console.log(data);
};

onMounted(async () => {
  runFn();
});

const formatDate = (date) => {
  const newDate = new Date(date);

  const day = String(newDate.getUTCDate()).padStart(2, "0");
  const month = String(newDate.getUTCMonth() + 1).padStart(2, "0");
  const year = newDate.getUTCFullYear();

  return `${day}-${month}-${year}`;
};

const cancelPopup = async (id) => {
  if (window.confirm("Are you sure to cancel the booking")) {
    const response = await fetch(`/vue/booking/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (response.status === 500) {
      info.value = "Something is wrong try again later";
      return;
    }

    if (response.status === 400) {
      info.value = data.status;
      return;
    }

    info.value = "Booking Cancelled";

    setTimeout(() => {
      runFn();
      info.value = "";
    }, 1000);
  } else {
    info.value = "Booking has not been cancelled THANKS";
  }
};
</script>
<template>
  <div>
    <h2>
      Payment Note This application does not support online payments or payment
      gateways. Any payment between the customer and property owner must be
      handled separately through methods such as UPI or cash.
    </h2>
    <router-link to="/cancellationPage">See cancellation policy</router-link>
  </div>

  <div>
    <div v-if="info">{{ info }}</div>
    <div v-if="userBookings.length === 0">No bookings to display</div>
  </div>
  <div>
    <div v-for="value in userBookings" :key="value._id">
      <label>Customer Name: {{ value.customerName }}</label
      ><br />
      <label>Check-in Date: {{ formatDate(value.checkInDate) }}</label
      ><br />
      <label>Check-out Date: {{ formatDate(value.checkOutDate) }}</label
      ><br />
      <label>Total Price: {{ value.price }}</label
      ><br />
      <label>Number of guests: {{ value.numberOfGuests }}</label
      ><br />
      <label>Booking status: {{ value.bookingStatus }}</label
      ><br />
      <label v-if="value.bookingStatus === 'CANCELLED'">
        Cancelled by: {{ value.cancelledBy }} </label
      ><br />
      <button @click="cancelPopup(value._id)">Cancel booking</button>
      <hr />
    </div>
  </div>
</template>
