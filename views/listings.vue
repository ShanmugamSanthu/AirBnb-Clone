<script setup>
import { ref, onMounted } from "vue";

const listing = ref([]);

onMounted(async () => {
  const response = await fetch("/vue");
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
