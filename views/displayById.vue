<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const listingInfo = ref({});
const reviewInfo = ref([]);
const loading = ref(true);
const urlID = useRoute();

// console.log(urlID.params.id);
onMounted(async () => {
  const response = await fetch(`/vue/listing/${urlID.params.id}`);
  const data = await response.json();
  listingInfo.value = data.listingData;
  reviewInfo.value = data.reviewData;
  loading.value = false;
  //   console.log(listingInfo.value);
  //   console.log(reviewInfo.value);
});
</script>
<template>
  <div v-if="loading">Just a moment...</div>
  <div v-else>
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
      <form
        :action="`/vue/listing/delete/${urlID.params.id}?_method=DELETE`"
        method="post"
      >
        <button>Delete Listing</button>
      </form>
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
      <form
        :action="`/vue/review/delete/${value._id}/${urlID.params.id}?_method=DELETE`"
        method="post"
      >
        <button>Delete Review</button>
      </form>
    </div>
    <hr />
  </div>
  <a href="/">Home</a>
  <!-- temp purpose navbar ll take over eventually-->
</template>
