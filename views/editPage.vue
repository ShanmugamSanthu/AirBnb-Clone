<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { authNCheck } from "../utils/authCheck";

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

  const response = await fetch(`/vue/listing/edit/update/${urlId.params.id}`, {
    method: "PATCH",
    body: formData,
  });
  if (response.status === 200) {
    info.value = "Changes updated please wait";
    setTimeout(() => {
      router.push(`/listing/${urlId.params.id}`);
    }, 3000);
  } else {
    info.value = "Something is wrong try again later";
  }
};
</script>
<template>
  <h2>Change any details</h2>
  <div v-if="loading">Just a moment...</div>
  <div v-else>
    <div v-if="info">
      <h3>{{ info }}</h3>
    </div>
    <form @submit.prevent="saveChanges">
      <label for="title">Title</label>
      <input
        type="text"
        id="title"
        v-model="listingInfo.Title"
        name="listing[Title]"
      />
      <br />
      <label for="desc">Description</label>
      <textarea
        name="listing[Description]"
        id="desc"
        v-model="listingInfo.Description"
      ></textarea>
      <br />
      <label for="price">Price</label>
      <input
        type="text"
        id="price"
        v-model="listingInfo.Price"
        name="listing[Price]"
      />
      <br />
      <label for="location">Location</label>
      <input
        type="text"
        id="location"
        v-model="listingInfo.Location"
        name="listing[Location]"
      />
      <br />
      <label for="country">Country</label>
      <input
        type="text"
        id="country"
        v-model="listingInfo.Country"
        name="listing[Country]"
      />
      <br />
      <label for="img">Upload a image</label>
      <input type="file" id="img" name="listing[Image]" />
      <br />
      <button>Save changes</button>
    </form>
  </div>
</template>
