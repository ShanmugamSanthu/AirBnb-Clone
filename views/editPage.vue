<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { authNCheck } from "../utils/authCheck";

const listingInfo = ref({});
const urlId = useRoute();
const loading = ref(true);
const router = useRouter();

onMounted(async () => {
  const response = await authNCheck(
    `/vue/listing/edit/${urlId.params.id}`,
    router,
  );
  if (!response) return;
  const data = await response.json();
  listingInfo.value = data.listingData;
  loading.value = false;
  console.log(listingInfo.value);
});
</script>
<template>
  <h2>Change any details</h2>
  <div v-if="loading">Just a moment...</div>
  <div v-else>
    <form
      :action="`/vue/listing/edit/update/${urlId.params.id}?_method=PATCH`"
      method="post"
      enctype="multipart/form-data"
    >
      <label for="title">Title</label>
      <input
        type="text"
        id="title"
        v-model="listingInfo.Title"
        name="listing[Title]"
        required
      />
      <br />
      <label for="desc">Description</label>
      <textarea
        name="listing[Description]"
        id="desc"
        v-model="listingInfo.Description"
        required
      ></textarea>
      <br />
      <label for="price">Price</label>
      <input
        type="text"
        id="price"
        v-model="listingInfo.Price"
        name="listing[Price]"
        required
        min="1"
      />
      <br />
      <label for="location">Location</label>
      <input
        type="text"
        id="location"
        v-model="listingInfo.Location"
        name="listing[Location]"
        required
      />
      <br />
      <label for="country">Country</label>
      <input
        type="text"
        id="country"
        v-model="listingInfo.Country"
        name="listing[Country]"
        required
      />
      <br />
      <label for="img">Upload a image</label>
      <input type="file" id="img" name="listing[Image]" />
      <br />
      <button>Save changes</button>
    </form>
  </div>
  <a href="/">Home</a>
</template>
