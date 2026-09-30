<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { authNCheck } from "../utils/authCheck";

const listing = ref([]);
const router = useRouter();

onMounted(async () => {
  const response = await authNCheck("/vue", router);
  if (!response) return;

  const data = await response.json();

  listing.value = data;
  // console.log(listing.value.userData);
});
</script>

<template>
  <div>
    <RouterLink to="/listing/new">New Listing</RouterLink>
  </div>
  <div v-for="item in listing.userData" :key="item._id">
    <div>
      <RouterLink :to="`/listing/${item._id}`">{{ item.Title }}</RouterLink>
      <br />
      <img :src="item.Image" /><br />
      {{ item.Description }}
    </div>
    <hr />
  </div>
</template>
