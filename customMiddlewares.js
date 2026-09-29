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
    console.log("please fill accordingly to our requirements");
    const newErr = new ExpressError("", 400);
    return next(newErr);
  }
  next();
};

// review validation middleware
const reviewValidation = (req, res, next) => {
  console.log(req.body.listingReview);
  const { error: newErr } = reviewSchema.validate(req.body.listingReview);
  if (newErr) {
    console.log("please add the review details accordingly");
    const newErr = new ExpressError("", 400);
    return next(newErr);
  }
  next();
};

// user validation middleware
const userValidation = (req, res, next) => {
  const { error: newErr } = userSchema.validate(req.body);
  if (newErr) {
    console.log("please fill account the details accordingly");
    const newErr = new ExpressError("", 400);
    return next(newErr);
  }
  next();
};

//email login Check middleware
const verifyEmail = async (req, res, next) => {
  const { username, userEmail } = req.body;
  const result = await userAccount.findOne({ username: username });
  if (!result) {
    const newErr = new ExpressError("Account doesnt exist", 400);
    return next(newErr);
  }
  if (!(result.userEmail.toLowerCase() === userEmail.toLowerCase())) {
    console.log("Invalid email credentials");
    const newErr = new ExpressError("", 400);
    return next(newErr);
  }
  next();
};

//error handling middleware
const errorHandler = (err, req, res, next) => {
  if (err) {
    if (err.statusCode === 400) {
      res.status(400).json("Bad request");
      return;
    }
    if (err.statusCode === 500) {
      console.log(err);
      res.status(500).json("Something is wrong");
      return;
    }
    if (err.statusCode === 200) {
      res.status(200).json("Account exists login with same credentials");
      return;
    }
    if (err.statusCode === 409) {
      res.status(409).json("Username already taken try a different name");
      return;
    }
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
