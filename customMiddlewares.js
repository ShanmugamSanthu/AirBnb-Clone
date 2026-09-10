import listingsSchema from "./serverSchema/serverSchemaListing.js";
import reviewSchema from "./serverSchema/serverSchemaReview.js";
import userSchema from "./serverSchema/serverSchemaUser.js";
import ExpressError from "./error.js";

//authorization middleware
const authorizationCheck = (req, res, next) => {
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
  authorizationCheck,
  listingValidation,
  reviewValidation,
  errorHandler,
  userValidation,
};
