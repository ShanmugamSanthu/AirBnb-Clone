<script setup>
import { ref, onMounted } from "vue";

const listing = ref([]);

onMounted(async () => {
  const response = await fetch("http://localhost:8080/vue/listing");
  const data = await response.json();

  listing.value = data;
});
</script>

<template>
  <div v-for="item in listing" :key="item._id">
    {{ item.Title }} <br />
    <img :src="item.Image" height="100px" width="100px" /><br />
    {{ item.Description }}
  </div>
</template>
