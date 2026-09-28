<script setup>
import StarRatingModule from "vue-star-rating";
import { ref } from "vue";
import { useRoute } from "vue-router";
const urlID = useRoute();
const StarRating = StarRatingModule.default;
const rating = ref(0);
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

    <StarRating v-model:rating="rating" :increment="0.5" :show-rating="false" />

    <input type="hidden" name="listingReview[listingRating]" :value="rating" />
    <br />
    <br />
    <input
      type="hidden"
      :value="`${urlID.params.id}`"
      name="listingReview[listingID]"
    />
    <button>Submit</button>
  </form>
</template>
