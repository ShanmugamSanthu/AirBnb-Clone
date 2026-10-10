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
});
</script>

<template>
  <section class="page">
    <header class="page-heading">
      <div>
        <p class="muted">Find your next escape</p>
        <h1>Places to stay</h1>
      </div>
      <RouterLink class="button" to="/listing/new">New Listing</RouterLink>
    </header>
    <div class="listing-grid">
      <article
        v-for="item in listing.userData"
        :key="item._id"
        class="surface listing-card"
      >
        <img class="listing-card__image" :src="item.Image" :alt="item.Title" />
        <div class="listing-card__body">
          <RouterLink
            class="listing-card__title"
            :to="`/listing/${item._id}`"
            >{{ item.Title }}</RouterLink
          >
          <p class="muted">{{ item.Description }}</p>
        </div>
      </article>
    </div>
  </section>
</template>
