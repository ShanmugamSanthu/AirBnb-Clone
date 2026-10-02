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
  <h4 v-if="userNameInfo">Hi {{ userNameInfo }}</h4>
  <div><h1>Travel Bingo-Your Dream Destination at your finger tips</h1></div>

  <h3>
    <div class="navbar">
      <router-link to="/" v-if="userNameInfo">Home</router-link>
      <router-link to="/aboutpage">About us</router-link>
      <router-link to="/mybookings">My Bookings</router-link>
      <router-link to="/managebookings">Manage Bookings</router-link>
      <div v-if="userNameInfo">
        <form action="/vue/user/logout" method="post">
          <button>Logout</button>
        </form>
      </div>
    </div>
  </h3>
  <slot />
</template>
