<script setup>
import sharedPage from "./views/shared_layout/sharedPage.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isPublicRoute = () => {
  return (
    route.path === "/user/loginpage" ||
    route.path === "/user/signuppage" ||
    route.path === "/aboutpage"
  );
};
</script>
<template>
  <RouterView v-if="isPublicRoute()" />

  <sharedPage v-else>
    <RouterView />
  </sharedPage>
</template>
