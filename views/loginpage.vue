<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const loginForm = async (event) => {
  const formData = new FormData(event.target);

  const response = await fetch("/vue/user/login", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(formData),
  });

  if (response.ok) {
    router.push("/");
  }
};
</script>

<template>
  <h1>Login</h1>
  <div>
    <form @submit.prevent="loginForm">
      <label for="userEmail">Email:</label>
      <input
        type="email"
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
