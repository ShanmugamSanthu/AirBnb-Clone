<script setup>
import { initCustomFormatter, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { authNCheck } from "../utils/authCheck";

const listingInfo = ref({});
const reviewInfo = ref([]);
const loading = ref(true);
const urlID = useRoute();
const router = useRouter();
const info = ref("");

onMounted(async () => {
  const response = await authNCheck(`/vue/listing/${urlID.params.id}`, router);
  if (!response) return;
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
    router.push("/");
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
    router.push(`/listing/${urlID.params.id}`);
  } else {
    info.value = "Something is wrong";
  }
};
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
  <div>
    <div>
      <router-link :to="`/listing/edit/${urlID.params.id}`">
        Edit Listing
      </router-link>
    </div>
    <br />
    <div>
      <button @click="deleteListing">Delete Listing</button>
    </div>
  </div>

  <hr />
  <hr />

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
