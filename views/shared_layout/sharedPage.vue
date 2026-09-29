<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { authNCheck, userAuthInfo } from "../../utils/authCheck";

const router = useRouter();
const userNameInfo = ref(null);

onMounted(async () => {
  const response = await authNCheck("/vue/user/current-user", router);
  if (!response) return;
  const data = await response.json();
  userAuthInfo(data.userName, router);
  userNameInfo.value = data.userName;
});
</script>
<template>
  <h4 v-if="userNameInfo">Hi {{ userNameInfo }}</h4>
  <div><h1>Travel Bingo-Your Dream Destination at your finger tips</h1></div>

  <h3>
    <div class="navbar">
      <router-link to="/">Home</router-link>
      <router-link to="/aboutpage">About us</router-link>
      <form action="/vue/user/logout" method="post">
        <button>Logout</button>
      </form>
    </div>
  </h3>
  <slot />
</template>
