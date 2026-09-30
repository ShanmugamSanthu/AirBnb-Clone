const loginCheck = (formData) => {
  const password = formData.get("password");
  const username = formData.get("username");
  const email = formData.get("userEmail");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let validData = true;
  let userWarning = "";

  if (!username?.trim() || username.length < 2) {
    userWarning = "Please enter a valid username";
    validData = false;
    return { validData, userWarning };
  }

  if (!password || password.length < 5) {
    userWarning =
      "Please enter a valid password, it should have a minimum of 5 characters";
    validData = false;
    return { validData, userWarning };
  }

  if (!emailPattern.test(email)) {
    userWarning = "Please enter a valid email ID";
    validData = false;
    return { validData, userWarning };
  }
  return { validData, userWarning };
};

const signUpCheck = (formData) => {
  const password = formData.get("password");
  const username = formData.get("username");
  const email = formData.get("userEmail");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let validData = true;
  let userWarning = "";

  if (!username?.trim() || username.length < 2) {
    userWarning = "Please enter a valid username";
    validData = false;
    return { validData, userWarning };
  }

  if (!password || password.length < 5) {
    userWarning =
      "Please enter a valid password, it should have a minimum of 5 characters";
    validData = false;
    return { validData, userWarning };
  }

  if (!emailPattern.test(email)) {
    userWarning = "Please enter a valid email ID";
    validData = false;
    return { validData, userWarning };
  }
  return { validData, userWarning };
};

const listingCheck = (formData) => {
  const title = formData.get("listing[Title]");
  const description = formData.get("listing[Description]");
  const country = formData.get("listing[Country]");
  const location = formData.get("listing[Location]");
  const price = formData.get("listing[Price]");

  let validData = true;
  let userWarning = "";

  if (!Number.isFinite(Number(price)) || Number(price) < 1) {
    userWarning = "Please enter a valid price, price should be minimum 1 ";
    validData = false;
    return { validData, userWarning };
  }
  if (
    !title?.trim() ||
    !description?.trim() ||
    !location?.trim() ||
    !country?.trim()
  ) {
    userWarning = "Please fill all the fields accordingly";
    validData = false;
    return { validData, userWarning };
  }
  return { validData, userWarning };
};

const reviewCheck = (formData) => {
  let validData = true;
  let userWarning = "";

  const ratingCheck = formData.get("listingReview[listingRating]");
  if (ratingCheck < 0.5 || ratingCheck > 5) {
    userWarning = "Rating must be between 1 and 5";
    validData = false;
    return { validData, userWarning };
  }
  return { validData, userWarning };
};
export { loginCheck, signUpCheck, listingCheck, reviewCheck };
