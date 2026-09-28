<script></script>
<template>
  <div><h1>Travel Bingo-Your Dream Destination at your finger tips</h1></div>

  <h3>
    <div class="navbar">
      <router-link to="/">Home</router-link>
      <router-link to="/aboutpage">About us</router-link>
      <form action="/vue/user/logout" method="post">
        <button>Logout</button>
      </form>
    </div>
  </h3>
  <slot />
</template>
