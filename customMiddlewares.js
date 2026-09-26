import listingsSchema from "./serverSchema/serverSchemaListing.js";
import reviewSchema from "./serverSchema/serverSchemaReview.js";
import userSchema from "./serverSchema/serverSchemaUser.js";
import ExpressError from "./error.js";
import userAccount from "./config_DB/models/userAccountSchema.js";

//authentication middleware
const authenticationCheck = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect("/user/loginpage");
  } else {
    next();
  }
};

//validation middleware edit and new listings
const listingValidation = (req, res, next) => {
  const { error: newErr } = listingsSchema.validate(req.body.listing);
  if (newErr) {
    const newErr = new ExpressError(
      "please fill accordingly to our requirements",
    );
    return next(newErr);
  }
  next();
};

// review validation middleware
const reviewValidation = (req, res, next) => {
  console.log(req.body.listingReview);
  const { error: newErr } = reviewSchema.validate(req.body.listingReview);
  if (newErr) {
    const newErr = new ExpressError(
      "please add the review details accordingly",
    );
    return next(newErr);
  }
  next();
};

// user validation middleware
const userValidation = (req, res, next) => {
  const { error: newErr } = userSchema.validate(req.body);
  if (newErr) {
    const newErr = new ExpressError(
      "please fill account the details accordingly",
      400,
    );
    return next(newErr);
  }
  next();
};

//email login Check middleware
const verifyEmail = async (req, res, next) => {
  const { username, userEmail } = req.body;
  const result = await userAccount.findOne({ username: username });
  if (!result) {
    const newErr = new ExpressError("Account doesnt exist");
    return next(newErr);
  }
  if (!(result.userEmail.toLowerCase() === userEmail.toLowerCase())) {
    const newErr = new ExpressError("Invalid email credentials");
    return next(newErr);
  }
  next();
};

//error handling middleware
const errorHandler = (err, req, res, next) => {
  if (err) {
    res.render("Error", {
      message: err.message,
      statusCode: err.statusCode,
    });
  }
};

export {
  verifyEmail,
  authenticationCheck,
  listingValidation,
  reviewValidation,
  errorHandler,
  userValidation,
};
