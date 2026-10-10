<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { listingCheck } from "../ClientSchema/uxValidation.js";
import { apiFetch } from "../api.js";

const router = useRouter();
const info = ref("");
const listingForm = async (event) => {
  const formData = new FormData(event.target);
  const result = listingCheck(formData);

  const title = formData.get("listing[Title]");
  const description = formData.get("listing[Description]");
  const country = formData.get("listing[Country]");
  const location = formData.get("listing[Location]");

  formData.set("listing[Title]", title.trim());
  formData.set("listing[Description]", description.trim());
  formData.set("listing[Country]", country.trim());
  formData.set("listing[Location]", location.trim());

  if (result.validData) {
    const response = await apiFetch("/vue/listing/new/add", {
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
  <section class="page">
    <header class="page-heading"><h1>Create a new listing</h1></header>
    <div class="surface form-card stack">
      <div v-if="info" class="notice" role="status">{{ info }}</div>
      <form class="form-fields" @submit.prevent="listingForm">
        <div class="form-field">
          <label for="title">Title</label>
          <input
            type="text"
            name="listing[Title]"
            placeholder="Enter Property Title"
            id="title"
            required
          />
        </div>
        <div class="form-field">
          <label for="Description">Description</label
          ><textarea name="listing[Description]" id="Description" required>
Add property description</textarea
          >
        </div>
        <div class="form-field">
          <label for="Price">Price</label>
          <input
            type="number"
            name="listing[Price]"
            placeholder="Mention price"
            id="Price"
            required
            min="1"
          />
        </div>
        <div class="form-field">
          <label for="Location">Location</label>
          <input
            type="text"
            name="listing[Location]"
            placeholder="Enter destination/location"
            id="Location"
            required
          />
        </div>
        <div class="form-field">
          <label for="Country">Country</label>
          <input
            type="text"
            name="listing[Country]"
            placeholder="Enter country name"
            id="Country"
            required
          />
        </div>
        <div class="form-field">
          <label for="maxGuests">Max number of guests allowed</label>
          <input
            type="number"
            name="listing[maxGuests]"
            placeholder="Enter total accommodation space "
            id="maxGuests"
            required
            min="1"
          />
        </div>
        <div class="form-field">
          <label for="img">Upload an image</label
          ><input type="file" name="listing[Image]" id="img" />
        </div>
        <button type="submit">Add Listing</button>
      </form>
    </div>
  </section>
</template>
