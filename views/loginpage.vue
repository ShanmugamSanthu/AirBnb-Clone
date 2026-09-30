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
  <div><h1>Travel Bingo-Your Dream Destination at your finger tips</h1></div>
  <hr />
  <h1>Login</h1>
  <div v-if="info">
    <h3>{{ info }}</h3>
  </div>
  <div>
    <form @submit.prevent="loginForm">
      <label for="userEmail">Email:</label>
      <input
        type="text"
        id="userEmail"
        name="userEmail"
        placeholder="Enter email"
      />

      <br /><br />

      <label for="username">Username:</label>
      <input
        type="text"
        id="username"
        name="username"
        placeholder="Enter username"
      />

      <br /><br />

      <label for="password">Password:</label>
      <input
        type="password"
        id="password"
        name="password"
        placeholder="Enter password"
      />

      <br /><br />

      <button type="submit">Login</button>
    </form>
  </div>
  <router-link to="/user/signuppage"
    >If you dont have a account signup here</router-link
  >
</template>
