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
  <div v-if="loading">Just a moment...</div>
  <div v-else>
    <div v-if="info">
      <h3>{{ info }}</h3>
    </div>
    <h2>{{ listingInfo.Title }}</h2>
    <h3>{{ listingInfo.Description }}</h3>
    <img :src="listingInfo.Image" alt="Image" />
    <h4>Location: {{ listingInfo.Location }}</h4>
    <h4>Price: &#8377;{{ listingInfo.Price.toLocaleString("en-IN") }}</h4>
    <h4>Country: {{ listingInfo.Country }}</h4>
    <h4>Posted by: {{ listingInfo.publisher.username }}</h4>
  </div>
  <hr />
  <hr />
  <div>
    <h3>Book this place</h3>
    <form @submit.prevent="submitBookingInfo">
      <label for="inDate">Check-in Date: </label>
      <input
        type="date"
        name="checkInDate"
        id="inDate"
        :min="today"
      /><br /><br />
      <label for="outDate">Check-out Date: </label>
      <input
        type="date"
        name="checkOutDate"
        id="outDate"
        :min="today"
      /><br /><br />
      <div v-if="bookedPrice">
        <label for="guests">Number of guests: </label>
        <input type="number" name="numberOfGuests" id="guests" /><br /><br />
        <label for="price"
          >Total Price: &#8377;{{ bookedPrice.toLocaleString("en-IN") }}</label
        >
        <br /><br />
        <button>Reserve</button>
      </div>
      <div>
        <h4>{{ bookingAvailable }}</h4>
      </div>
      <button type="button" @click="checkBooking" v-if="!bookedPrice">
        Check Availability
      </button>
    </form>
  </div>
  <br />
  <hr />
  <div>
    <div>
      <router-link :to="`/listing/edit/${urlID.params.id}`">
        Edit Listing
      </router-link>
    </div>

    <div>
      <button @click="deleteListing">Delete Listing</button>
    </div>
  </div>

  <h2>Hear from people about this place</h2>
  <router-link :to="`/review/new/${urlID.params.id}`">Add a review</router-link>
  <br />
  <div v-for="value in reviewInfo">
    <div>
      <h4>{{ value.listingComment }}</h4>
      <h4>Rating: {{ value.listingRating }}</h4>
      <h4>Author: {{ value.author.username }}</h4>
      <h4>Posted on: {{ new Date(value.createdAt).toLocaleString() }}</h4>

      <button @click="deleteReview(value._id)">Delete Review</button>
    </div>
    <hr />
  </div>
</template>
