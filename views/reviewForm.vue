<script setup>
// import StarRating from "vue-star-rating";
// import { ref } from "vue";
import { useRoute } from "vue-router";
const urlID = useRoute();
</script>
<template>
  <h2>Leave your thoughts about this place</h2>
  <form
    :action="`/vue/review/${urlID.params.id}/listing`"
    method="post"
    class="review"
  >
    <p id="ratingWarning"></p>
    <textarea name="listingReview[listingComment]"> Write a review</textarea>
    <br />
    <br />

    <input
      type="number"
      placeholder="Rate of 1-5"
      min="1"
      max="5"
      name="listingReview[listingRating]"
    />
    <br />
    <br />
    <input
      type="hidden"
      :value="`${urlID.params.id}`"
      name="listingReview[listingID]"
    />
    <button>Submit</button>
  </form>
  <a href="/">Home</a>
</template>
