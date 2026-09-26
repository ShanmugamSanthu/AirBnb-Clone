const listingForm = document.querySelector(".newListing");
const dataerror = document.querySelector("#error");
const reviewForm = document.querySelector(".review");
const reviewWarning = document.querySelector("#ratingWarning");
const signupForm = document.querySelector(".signupForm");
const loginForm = document.querySelector(".loginForm");
const userWarning = document.querySelector("#warningForm");
const messageTimer = document.querySelector("#successMessage");

if (messageTimer) {
  setTimeout(() => {
    messageTimer.remove();
  }, 5000);
}

if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    const formdata = new FormData(signupForm);
    const name = formdata.get("username");
    const password = formdata.get("password");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let validData = true;
    const email = formdata.get("userEmail");

    if (!password) {
      userWarning.textContent = "Please enter a valid password";
      validData = false;
    }
    if (!emailPattern.test(email)) {
      userWarning.textContent = "Please enter a valid email ID";
      validData = false;
    }
    if (!name?.trim()) {
      userWarning.textContent = "Please enter a valid user name";
      validData = false;
    }
    if (validData) {
      signupForm.submit();
    } else {
      e.preventDefault();
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    const formdata = new FormData(loginForm);
    const password = formdata.get("password");
    const username = formdata.get("username");

    let validData = true;

    if (!password) {
      userWarning.textContent = "Please enter a valid password";
      validData = false;
    }
    if (!username?.trim()) {
      userWarning.textContent = "Please enter a valid username";
      validData = false;
    }

    if (validData) {
      loginForm.submit();
    } else {
      e.preventDefault();
    }
  });
}

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
      const price = formdata.get("listing[Price]");

      if (!Number.isFinite(price) || price < 1) {
        dataerror.textContent = "Please enter a valid price";
        return true;
      }

      if (
        !title?.trim() ||
        !description?.trim() ||
        !location?.trim() ||
        !country?.trim()
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
