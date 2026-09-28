<script setup></script>

<template>
  <form action="/vue/user/login" method="post">
    <label for="userEmail">Email:</label>
    <input
      type="email"
      id="userEmail"
      name="userEmail"
      placeholder="Enter email"
      required
    />

    <br /><br />

    <label for="username">Username:</label>
    <input
      type="text"
      id="username"
      name="username"
      placeholder="Enter username"
      required
    />

    <br /><br />

    <label for="password">Password:</label>
    <input
      type="password"
      id="password"
      name="password"
      placeholder="Enter password"
      required
    />

    <br /><br />

    <button type="submit">Login</button>
  </form>
</template>
