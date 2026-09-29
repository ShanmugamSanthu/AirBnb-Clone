<script setup>
// const loginForm = async (event) => {
//   const formData = new FormData(event.target);
//   console.log(Object.fromEntries(formData));

//   try {
//     const response = await fetch("/vue/user/login", {
//       method: "POST",
//       "content-type": "application/x-www-form-urlencoded",
//       body: URLSearchParams(formData),
//     });
//   } catch (error) {}
// };
</script>

<template>
  <h1>Login</h1>
  <div>
    <form action="/vue/user/login" method="post">
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
