const userListingID = document.querySelector("#ListingID");
const userListingTitle = document.querySelector("#ListingTitle");

userListingTitle.addEventListener("click", () => {
  fetch(`/listings/${userListingID.value}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(() => {
      console.log("Sent");
    })
    .catch((err) => {
      console.log(err);
    });
});
