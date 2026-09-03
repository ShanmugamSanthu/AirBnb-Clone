const listingForm = document.querySelector(".newListing");
const dataerror = document.querySelector("#error");
const reviewForm = document.querySelector(".review");
const reviewWarning = document.querySelector("#ratingWarning");

if (reviewForm) {
  reviewForm.addEventListener("submit", (e) => {
    const formdata = new FormData(reviewForm);
    const ratingCheck = formdata.get("listingReview[listingRating]");
    if (ratingCheck < 1 || ratingCheck > 5) {
      reviewWarning.textContent = "Rating must be between 1 and 5";
      e.preventDefault();
    } else {
      reviewForm.submit();
    }
  });
}
if (listingForm) {
  listingForm.addEventListener("submit", (e) => {
    const formdata = new FormData(listingForm);
    function validation(formdata) {
      const title = formdata.get("listing[Title]");
      const description = formdata.get("listing[Description]");
      const country = formdata.get("listing[Country]");
      const location = formdata.get("listing[Location]");

      if (!Number.isFinite(price) || price < 1) {
        dataerror.textContent = "Please enter a valid price";
        return true;
      }

      if (
        !title?.trim() ||
        !description?.trim() ||
        !location?.trim() ||
        !country?.trim() ||
        !price?.trim()
      ) {
        dataerror.textContent = "Please fill all the fields";
        return true;
      }
      return null;
    }
    if (validation(formdata)) {
      e.preventDefault();
    } else {
      listingForm.submit();
    }
  });
}
