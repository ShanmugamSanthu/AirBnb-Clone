<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { signUpCheck } from "../ClientSchema/uxValidation.js";
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

const signupForm = async (event) => {
  const formData = new FormData(event.target);
  const result = signUpCheck(formData);

  if (result.validData) {
    const response = await fetch("/vue/user/signup", {
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
  <div><h1>Travel Bingo-Your Dream Destination at your finger tips</h1></div>
  <hr />
  <h1>Signup</h1>
  <div v-if="info">
    <h3>{{ info }}</h3>
  </div>
  <div>
    <form @submit.prevent="signupForm">
      Enter email ID:
      <input
        type="text"
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
