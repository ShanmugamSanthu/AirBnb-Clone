<script setup></script>
<template>
  <h1>Signup</h1>
  <div>
    <form action="/user/signup" method="post" class="signupForm">
      Enter email ID:
      <input
        type="email"
        name="userEmail"
        placeholder="Enter a valid email ID"
        required
      />
      <br /><br />
      Enter username:
      <input
        type="text"
        name="username"
        placeholder="Enter a username"
        minlength="2"
        required
      />
      <br /><br />
      Enter a password:
      <input
        type="text"
        name="password"
        placeholder="Enter password"
        minlength="5"
        required
      />
      <br /><br />
      <button>Signup</button>
    </form>
  </div>
  <router-link to="/user/loginpage"
    >If you already have a account login here</router-link
  >
</template>
