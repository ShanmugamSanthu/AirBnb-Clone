<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { signUpCheck } from "../ClientSchema/uxValidation.js";
import { onMounted } from "vue";
import { apiFetch } from "../api.js";

const router = useRouter();
const info = ref("");

onMounted(async () => {
  const response = await apiFetch("/vue/user/current-user");
  const data = await response.json();

  if (data.userName) {
    router.push("/");
  }
});

const signupForm = async (event) => {
  const formData = new FormData(event.target);
  const result = signUpCheck(formData);
  const username = formData.get("username");
  const email = formData.get("userEmail");

  formData.set("username", username.trim());
  formData.set("userEmail", email.trim());
  if (result.validData) {
    const response = await apiFetch("/vue/user/signup", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(formData),
    });

    if (response.status === 201) {
      info.value = "Account created successfully login with same credentials";
      setTimeout(() => {
        router.push("/user/loginpage");
      }, 3000);
    } else if (response.status === 200) {
      info.value = "Account exists login with same credentials";
    } else if (response.status === 409) {
      info.value = "Username already taken try a different name";
    } else {
      info.value = "Something is wrong try again later";
    }
  } else {
    info.value = result.userWarning;
  }
};
</script>
<template>
  <section class="auth-page">
    <header class="auth-brand">
      <h1>Travel Bingo</h1>
      <p>Your dream destination at your fingertips</p>
    </header>
    <div class="surface stack">
      <h2>Create your account</h2>
      <div v-if="info" class="notice" role="status">{{ info }}</div>
      <form class="form-fields" @submit.prevent="signupForm">
        <div class="form-field">
          <label for="signup-email">Email ID</label>
          <input
            type="email"
            id="signup-email"
            name="userEmail"
            placeholder="Enter a valid email ID"
            required
          />
        </div>
        <div class="form-field">
          <label for="signup-username">Username</label>
          <input
            type="text"
            id="signup-username"
            name="username"
            placeholder="Enter a username"
            required
          />
        </div>
        <div class="form-field">
          <label for="signup-password">Password</label>
          <input
            type="password"
            id="signup-password"
            name="password"
            placeholder="Enter password"
            required
          />
        </div>
        <button>Signup</button>
      </form>
      <router-link to="/user/loginpage"
        >Already have an account? Log in here</router-link
      >
    </div>
  </section>
</template>
