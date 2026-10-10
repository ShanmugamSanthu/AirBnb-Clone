<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { authNCheck, userAuthInfo } from "../../utils/authCheck";

const router = useRouter();
const route = useRoute();
const userNameInfo = ref(null);

const namedInfofn = async () => {
  const response = await authNCheck("/vue/user/current-user", router);

  if (!response) return;
  const data = await response.json();
  userAuthInfo(data.userName, router);
  userNameInfo.value = data.userName;
};
onMounted(() => {
  namedInfofn();
});

watch(
  () => route.path,
  () => {
    namedInfofn();
  },
);
</script>
<template>
  <header class="site-header">
    <div class="site-header__inner">
      <router-link class="brand" to="/">Travel Bingo</router-link>
      <span v-if="userNameInfo" class="user-greeting">Hi {{ userNameInfo }}</span>
      <nav class="nav" aria-label="Main navigation">
      <router-link to="/" v-if="userNameInfo">Home</router-link>
      <router-link to="/aboutpage">About us</router-link>
      <router-link to="/mybookings">My Bookings</router-link>
      <router-link to="/managebookings">Manage Bookings</router-link>
      <div v-if="userNameInfo">
        <form action="/vue/user/logout" method="post">
          <button>Logout</button>
        </form>
      </div>
      </nav>
    </div>
  </header>
  <main><slot /></main>
</template>
