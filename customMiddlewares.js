import listingsSchema from "./serverSchema/serverSchema.js";
import reviewSchema from "./serverSchema/serverSchemaReview.js";

//authorization middleware
const authorizationCheck = (req, res, next) => {
  if (!req.session.userID) {
    res.redirect("/user/loginpage");
  } else {
    next();
  }
};

//validation middleware edit and new listings
const listingValidation = (req, res, next) => {
  const { error } = listingsSchema.validate(req.body.listing);
  if (error) {
    return res.render("Error", { error }); // separte error page
  }
  next();
};

// review validation middleware
const reviewValidation = (req, res, next) => {
  const { error1 } = reviewSchema.validate(req.body.listingReview);
  if (error1) {
    return res.render("Error", { error1, error: null, reviewError: null });
  } else {
    next();
  }
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
};
