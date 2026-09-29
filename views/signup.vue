<script setup></script>
<template>
  <h1>Signup</h1>
  <div>
    <form action="/vue/user/signup" method="post" class="signupForm">
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
