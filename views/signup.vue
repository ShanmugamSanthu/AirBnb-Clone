<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();
const info = ref("");

const signupForm = async (event) => {
  const formData = new FormData(event.target);

  const response = await fetch("/vue/user/signup", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(formData),
  });

  if (response.status === 200) {
    info.value = "Account exists login with same credentials";
    setTimeout(() => {
      router.push("/user/loginpage");
    }, 3000);
  } else if (response.status === 409) {
    info.value = "Username already taken try a different name";
  } else {
    if (response.ok) {
      info.value = "Account created successfully login with same credentials";
      setTimeout(() => {
        router.push("/user/loginpage");
      }, 3000);
    }
  }
};
</script>
<template>
  <h1>Signup</h1>
  <div v-if="info">
    <h3>{{ info }}</h3>
  </div>
  <div>
    <form @submit.prevent="signupForm">
      Enter email ID:
      <input
        type="email"
        name="userEmail"
        placeholder="Enter a valid email ID"
      />
      <br /><br />
      Enter username:
      <input type="text" name="username" placeholder="Enter a username" />
      <br /><br />
      Enter a password:
      <input type="text" name="password" placeholder="Enter password" />
      <br /><br />
      <button>Signup</button>
    </form>
  </div>
  <router-link to="/user/loginpage"
    >If you already have a account login here</router-link
  >
</template>
