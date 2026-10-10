<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { authNCheck } from "../utils/authCheck";
import { listingCheck } from "../ClientSchema/uxValidation.js";
import { apiFetch } from "../api.js";

const listingInfo = ref({});
const urlId = useRoute();
const loading = ref(true);
const router = useRouter();
const info = ref("");

onMounted(async () => {
  const response = await authNCheck(
    `/vue/listing/edit/${urlId.params.id}`,
    router,
  );
  if (!response) return;
  const data = await response.json();
  listingInfo.value = data.listingData;
  loading.value = false;
});

const saveChanges = async (event) => {
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
    const response = await apiFetch(
      `/vue/listing/edit/update/${urlId.params.id}`,
      {
        method: "PATCH",
        body: formData,
      },
    );
    if (response.status === 200) {
      info.value = "Changes updated please wait";
      setTimeout(() => {
        router.push(`/listing/${urlId.params.id}`);
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
    <header class="page-heading"><h1>Change listing details</h1></header>
    <div v-if="loading" class="empty-state">Just a moment...</div>
    <div v-else class="surface form-card stack">
      <div v-if="info" class="notice" role="status">{{ info }}</div>
      <form class="form-fields" @submit.prevent="saveChanges">
        <div class="form-field">
          <label for="title">Title</label>
          <input
            type="text"
            id="title"
            v-model="listingInfo.Title"
            name="listing[Title]"
            required
          />
        </div>
        <div class="form-field">
          <label for="desc">Description</label>
          <textarea
            name="listing[Description]"
            id="desc"
            v-model="listingInfo.Description"
            required
          ></textarea>
        </div>
        <div class="form-field">
          <label for="price">Price</label>
          <input
            type="number"
            id="price"
            v-model="listingInfo.Price"
            name="listing[Price]"
            required
            min="1"
          />
        </div>
        <div class="form-field">
          <label for="location">Location</label>
          <input
            type="text"
            id="location"
            v-model="listingInfo.Location"
            name="listing[Location]"
            required
          />
        </div>
        <div class="form-field">
          <label for="country">Country</label>
          <input
            type="text"
            id="country"
            v-model="listingInfo.Country"
            name="listing[Country]"
            required
          />
        </div>
        <div class="form-field">
          <label for="maxGuests">Max number of guests allowed</label>
          <input
            type="text"
            name="listing[maxGuests]"
            placeholder="Enter total accommodation space "
            id="maxGuests"
            required
            min="1"
            v-model="listingInfo.maxGuests"
          />
        </div>
        <div class="form-field">
          <label for="img">Upload an image</label
          ><input type="file" id="img" name="listing[Image]" />
        </div>
        <button>Save changes</button>
      </form>
    </div>
  </section>
</template>
