<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { listingCheck } from "../ClientSchema/uxValidation.js";

const router = useRouter();
const info = ref("");
const listingForm = async (event) => {
  const formData = new FormData(event.target);
  const result = listingCheck(formData);

  if (result.validData) {
    const response = await fetch("/vue/listing/new/add", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      info.value = "Listing created successfully redirecting to home page";
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } else {
      info.value = "Something is wrong try again later";
    }
  } else {
    info.value = result.userWarning;
  }
};
</script>
<template>
  <h2>
    <div>Create a new Listing</div>
  </h2>
  <div v-if="info">
    <h3>{{ info }}</h3>
  </div>
  <form @submit.prevent="listingForm">
    <label for="title">Title </label>
    <input
      type="text"
      name="listing[Title]"
      placeholder="Enter Property Title"
      id="title"
    />
    <br /><br />
    <label for="Description">Description </label>
    <textarea name="listing[Description]" id="Description">
Add description</textarea
    >
    <br /><br />
    <label for="Price">Price </label>
    <input
      type="text"
      name="listing[Price]"
      placeholder="Mention price"
      id="Price"
    />

    <br /><br />
    <label for="Location">Location </label>
    <input
      type="text"
      name="listing[Location]"
      placeholder="Enter destination/location"
      id="Location"
    />

    <br /><br />
    <label for="Country">Country </label>
    <input
      type="text"
      name="listing[Country]"
      placeholder="Enter country name"
      id="Country"
    />

    <br /><br />
    <label for="img">Upload a image </label>
    <input type="file" name="listing[Image]" id="img" />
    <br /><br />
    <button type="submit">Add Listing</button>
  </form>
</template>
