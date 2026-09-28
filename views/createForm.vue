<script setup></script>
<template>
  <h2>
    <div>Create a new Listing</div>
  </h2>
  <form
    action="/vue/listing/new/add"
    method="post"
    class="newListing"
    enctype="multipart/form-data"
  >
    <label for="title">Title </label>
    <input
      type="text"
      name="listing[Title]"
      placeholder="Enter Property Title"
      id="title"
      required
    />
    <br /><br />
    <label for="Description">Description </label>
    <textarea name="listing[Description]" id="Description" required>
Add description</textarea
    >
    <br /><br />
    <label for="Price">Price </label>
    <input
      type="number"
      name="listing[Price]"
      placeholder="Mention price"
      id="Price"
      required
      min="1"
    />

    <br /><br />
    <label for="Location">Location </label>
    <input
      type="text"
      name="listing[Location]"
      placeholder="Enter destination/location"
      id="Location"
      required
    />

    <br /><br />
    <label for="Country">Country </label>
    <input
      type="text"
      name="listing[Country]"
      placeholder="Enter country name"
      id="Country"
      required
    />

    <br /><br />
    <label for="img">Upload a image </label>
    <input type="file" name="listing[Image]" id="img" />
    <br /><br />
    <button type="submit">Add Listing</button>
  </form>
</template>
