<script setup>
import StarRatingModule from "vue-star-rating";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { reviewCheck } from "../ClientSchema/uxValidation.js";
import { apiFetch } from "../api.js";

const urlID = useRoute();
const StarRating = StarRatingModule.default;
const rating = ref(0);
const info = ref("");
const router = useRouter();

const addReview = async (event) => {
  const formData = new FormData(event.target);

  const result = reviewCheck(formData);
  if (result.validData) {
    const response = await apiFetch(`/vue/review/${urlID.params.id}/listing`, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(formData),
    });
    if (response.ok) {
      info.value = "Review added successfully";
      setTimeout(() => {
        router.push(`/listing/${urlID.params.id}`);
      }, 1000);
    } else {
      info.value = "Something is wrong try again later";
    }
  } else {
    info.value = result.userWarning;
  }
};
</script>
<template>
  <section class="page">
    <header class="page-heading"><h1>Leave your thoughts</h1></header>
    <form class="surface form-card form-fields" @submit.prevent="addReview">
      <div v-if="info" class="notice" role="status">{{ info }}</div>
      <p id="ratingWarning"></p>
      <div class="form-field">
        <label for="review-comment">Your review</label
        ><textarea id="review-comment" name="listingReview[listingComment]">
 Write a review</textarea
        >
      </div>
      <div class="form-field">
        <label>Your rating</label
        ><StarRating
          v-model:rating="rating"
          :increment="1"
          :show-rating="false"
        />
      </div>

      <input
        type="hidden"
        name="listingReview[listingRating]"
        :value="rating"
        required
      />
      <input
        type="hidden"
        :value="`${urlID.params.id}`"
        name="listingReview[listingID]"
      />
      <button>Submit</button>
    </form>
  </section>
</template>
