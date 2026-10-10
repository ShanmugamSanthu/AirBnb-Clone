<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { authNCheck } from "../utils/authCheck";

const listingInfo = ref({});
const reviewInfo = ref([]);
const loading = ref(true);
const urlID = useRoute();
const router = useRouter();
const info = ref("");
const bookedPrice = ref("");
const bookingAvailable = ref("");

onMounted(async () => {
  const response = await authNCheck(`/vue/listing/${urlID.params.id}`, router);
  if (!response) return;
  if (response.url.endsWith("/")) {
    router.push("/");
    return null;
  }
  const data = await response.json();
  listingInfo.value = data.listingData;
  reviewInfo.value = data.reviewData;
  loading.value = false;
});

const deleteListing = async () => {
  const response = await fetch(`/vue/listing/delete/${urlID.params.id}`, {
    method: "DELETE",
  });
  if (response.ok) {
    info.value = "Deleting please wait";
    setTimeout(() => {
      router.push("/");
    }, 2000);
  } else {
    info.value = "Something is wrong";
  }
};

const deleteReview = async (id) => {
  const response = await fetch(`/vue/review/delete/${id}/${urlID.params.id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    info.value = "Deleting please wait";
    setTimeout(() => {
      router.push(`/`);
    }, 2000);
  } else {
    info.value = "Something is wrong";
  }
};

const submitBookingInfo = async (event) => {
  const formData = new FormData(event.target);
  const checkInDate = formData.get("checkInDate");
  const checkOutDate = formData.get("checkOutDate");
  const numberOfGuests = Number(formData.get("numberOfGuests"));

  const [yearIn, monthIn, dayIn] = checkInDate.split("-");
  const formattedCheckIn = `${dayIn}-${monthIn}-${yearIn}`;

  const [yearOut, monthOut, dayOut] = checkOutDate.split("-");
  const formattedCheckOut = `${dayOut}-${monthOut}-${yearOut}`;

  if (!checkInDate || !checkOutDate) {
    bookingAvailable.value = "Please select both dates";
    return;
  }
  if (checkInDate > checkOutDate) {
    bookingAvailable.value = "Check out date should be minimum 24 Hrs";
    return;
  }

  if (numberOfGuests < 1 || isNaN(numberOfGuests) || !numberOfGuests) {
    bookingAvailable.value = "Number of guests should be atleast 1";
    return;
  }
  if (numberOfGuests > listingInfo.maxGuests) {
    bookingAvailable.value = `Number of guests cannot exceed ${listingInfo.maxGuests}`;
    return;
  }

  const response = await fetch(`/vue/booking/${urlID.params.id}`, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      checkInDate: formattedCheckIn,
      checkOutDate: formattedCheckOut,
      numberOfGuests: formData.get("numberOfGuests"),
    }),
  });
  const data = await response.json();
  bookingAvailable.value = data.status;
};

const checkBooking = async (event) => {
  const form = event.target.closest("form");
  const formData = new FormData(form);

  const checkInDate = formData.get("checkInDate");
  const checkOutDate = formData.get("checkOutDate");

  const [yearIn, monthIn, dayIn] = checkInDate.split("-");
  const formattedCheckIn = `${dayIn}-${monthIn}-${yearIn}`;

  const [yearOut, monthOut, dayOut] = checkOutDate.split("-");
  const formattedCheckOut = `${dayOut}-${monthOut}-${yearOut}`;

  if (!checkInDate || !checkOutDate) {
    bookingAvailable.value = "Please select both dates";
    return;
  }
  if (checkInDate > checkOutDate) {
    bookingAvailable.value = "Check out date should be minimum 24 Hrs ";
    return;
  }

  const response = await fetch(
    `/vue/booking/${urlID.params.id}?checkInDate=${formattedCheckIn}&checkOutDate=${formattedCheckOut}`,
    {
      method: "GET",
    },
  );

  const data = await response.json();
  bookedPrice.value = data.bookedPrice;
  bookingAvailable.value = data.status;
};

const today = new Date().toISOString().split("T")[0];
</script>
<template>
  <section class="page"><div v-if="loading" class="empty-state">Just a moment...</div><div v-else class="detail-grid"><article class="stack-lg"><div v-if="info" class="notice" role="status">{{ info }}</div><div class="stack"><h1>{{ listingInfo.Title }}</h1><p class="muted">{{ listingInfo.Description }}</p></div><img class="detail-image" :src="listingInfo.Image" :alt="listingInfo.Title" /><div class="surface facts"><span>Location: {{ listingInfo.Location }}</span><span>Price: &#8377;{{ listingInfo.Price.toLocaleString("en-IN") }}</span><span>Country: {{ listingInfo.Country }}</span><span>Maximum guests: {{ listingInfo.maxGuests }}</span><span>Posted by: {{ listingInfo.publisher.username }}</span></div><div class="cluster"><router-link class="button" :to="`/listing/edit/${urlID.params.id}`">Edit Listing</router-link><button class="danger" @click="deleteListing">Delete Listing</button></div></article><aside class="surface booking-card stack"><h2>Book this place</h2><form class="form-fields" @submit.prevent="submitBookingInfo"><div class="form-field"><label for="inDate">Check-in date</label>
      <input
        type="date"
        name="checkInDate"
        id="inDate"
        :min="today"
      /></div><div class="form-field"><label for="outDate">Check-out date</label>
      <input
        type="date"
        name="checkOutDate"
        id="outDate"
        :min="today"
      /></div>
      <div v-if="bookedPrice">
        <div class="form-field"><label for="guests">Number of guests</label><input type="number" name="numberOfGuests" id="guests" /></div><p>Total Price: &#8377;{{ bookedPrice.toLocaleString("en-IN") }}</p>
        <button>Reserve</button>
      </div>
      <div v-if="bookingAvailable" class="notice" role="status">{{ bookingAvailable }}</div>
      <button type="button" @click="checkBooking" v-if="!bookedPrice">
        Check Availability
      </button>
    </form></aside></div><section class="stack-lg" style="margin-top:2rem"><div class="page-heading"><h2>Hear from people about this place</h2><router-link class="button" :to="`/review/new/${urlID.params.id}`">Add a review</router-link></div><div class="review-list"><article v-for="value in reviewInfo" :key="value._id" class="surface review-card"><p>{{ value.listingComment }}</p><span class="muted">Rating: {{ value.listingRating }} · Author: {{ value.author.username }}</span><span class="muted">Posted on: {{ new Date(value.createdAt).toLocaleString() }}</span><button class="danger" @click="deleteReview(value._id)">Delete Review</button></article></div></section></section>
</template>
