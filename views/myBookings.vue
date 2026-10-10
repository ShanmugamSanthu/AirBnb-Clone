<script setup>
import { onMounted, ref } from "vue";

const userBookings = ref([]);
const info = ref("");

const runFn = async () => {
  const response = await fetch("/vue/booking/mybookings", {
    method: "GET",
  });

  if (response.status === 500) {
    info.value = "Something is wrong try again later";
    return;
  }
  const data = await response.json();

  userBookings.value = data;
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
  <section class="page stack-lg"><header class="stack"><h1>My bookings</h1><p class="muted">Payment is arranged directly with the property owner by UPI or cash.</p><router-link to="/cancellationPage">See cancellation policy</router-link></header><div v-if="info" class="notice" role="status">{{ info }}</div><div v-if="userBookings.length === 0" class="empty-state">No bookings to display</div><div class="booking-list"><article v-for="value in userBookings" :key="value._id" class="surface booking-card-item"><div class="booking-card-item__facts"><span>Owner: {{ value.ownerName }}</span><span>Check-in: {{ formatDate(value.checkInDate) }}</span><span>Check-out: {{ formatDate(value.checkOutDate) }}</span><span>Total price: {{ value.price }}</span><span>Guests: {{ value.numberOfGuests }}</span><span>Status: {{ value.bookingStatus }}</span><span v-if="value.bookingStatus === 'CANCELLED'">Cancelled by: {{ value.cancelledBy }}</span></div><button @click="cancelPopup(value._id)">Cancel Booking</button></article></div></section>
</template>
