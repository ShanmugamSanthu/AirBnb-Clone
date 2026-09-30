<script setup>
import StarRatingModule from "vue-star-rating";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const urlID = useRoute();
const StarRating = StarRatingModule.default;
const rating = ref(0);
const info = ref("");
const router = useRouter();

const addReview = async (event) => {
  const formData = new FormData(event.target);

  const response = await fetch(`/vue/review/${urlID.params.id}/listing`, {
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
};
</script>
<template>
  <h2>Leave your thoughts about this place</h2>
  <div v-if="info">
    <h3>{{ info }}</h3>
  </div>
  <form @submit.prevent="addReview">
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
