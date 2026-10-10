<script setup>
import { useRouter } from "vue-router";
import { loginCheck } from "../ClientSchema/uxValidation.js";
import { ref } from "vue";
import { onMounted } from "vue";

const router = useRouter();
const info = ref("");

onMounted(async () => {
  const response = await fetch("/vue/user/current-user");
  const data = await response.json();

  if (data.userName) {
    router.push("/");
  }
});
const loginForm = async (event) => {
  const formData = new FormData(event.target);
  const result = loginCheck(formData);
  const username = formData.get("username");
  const email = formData.get("userEmail");

  formData.set("username", username.trim());
  formData.set("userEmail", email.trim());
  if (result.validData) {
    const response = await fetch("/vue/user/login", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(formData),
    });

    if (response.status === 200) {
      router.push("/");
    } else if (response.status === 400) {
      info.value = "Account doesn't exist. Please create an account.";
    } else if (response.status === 403) {
      info.value = "Email doesn't match the account";
    } else if (response.status === 401) {
      info.value = "Invalid username or password";
    } else {
      info.value = "Something is wrong try again later";
    }
  } else {
    info.value = result.userWarning;
  }
};
</script>

<template>
  <section class="auth-page"><header class="auth-brand"><h1>Travel Bingo</h1><p>Your dream destination at your fingertips</p></header><div class="surface stack"><h2>Welcome back</h2><div v-if="info" class="notice" role="status">{{ info }}</div><form class="form-fields" @submit.prevent="loginForm"><div class="form-field"><label for="userEmail">Email</label>
      <input
        type="email"
        id="userEmail"
        name="userEmail"
        placeholder="Enter email"
        required
      /></div><div class="form-field"><label for="username">Username</label>
      <input
        type="text"
        id="username"
        name="username"
        placeholder="Enter username"
        required
      /></div><div class="form-field"><label for="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        placeholder="Enter password"
        required
      /></div><button type="submit">Login</button></form><router-link to="/user/signuppage">Don’t have an account? Sign up here</router-link></div></section>
</template>
