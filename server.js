import express from "express";
import methodOverride from "method-override";
import connectDB from "./config_DB/DBconnection.js";
import list from "./config_DB/models/listingsSchema.js";
import engine from "ejs-mate";
import listingReview from "./config_DB/models/listingReviewSchema.js";
import reviewSchema from "./serverSchemaReview.js";
import listingsSchema from "./serverSchema.js";
import mongoose from "mongoose";

//middlewares
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
// app.use(express.static("views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", engine);

//validation middleware edit and new listings
const listingValidation = (req, res, next) => {
  const { error } = listingsSchema.validate(req.body.listing);
  if (error) {
    return res.render("Error", { error }); // separte error page
  }
  next();
};
const reviewValidation = (req, res, next) => {
  const { error1 } = reviewSchema.validate(req.body.listingReview);
  if (error1) {
    return res.render("Error", { error1, error: null, reviewError: null });
  } else {
    next();
  }
};

//connect DB and server
connectDB()
  .then(() => {
    console.log("DataBase Connected Successfully");
    app.listen(8080, "0.0.0.0", () => {
      console.log("Server Live");
    });
  })
  .catch((err) => {
    console.log("DataBase Connection Error-", err);
  });

// render listing form
app.get("/listings/new", (req, res) => {
  res.render("addListing", { error: null, listingData: null });
});

//get listings
app.get("/", async (req, res) => {
  const userData = await list.find({});
  res.render("index", { userData });
});

// add new listing to DB
app.post("/listing/new/add", listingValidation, async (req, res) => {
  try {
    await list.create(req.body.listing);
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.send("Couldnt add the listing try later");
  }
});

//edit page render
app.get("/listings/edit/:id", async (req, res) => {
  const listingid = req.params.id;
  const listingData = await list.findById(listingid);
  res.render("editForm", { listingData, error: null });
});

//save edited listing form
app.patch("/listing/edit/update/:id", listingValidation, async (req, res) => {
  const objID = req.params.id;
  try {
    await list.findByIdAndUpdate(objID, req.body.listing, {
      runValidators: true,
    });
    res.redirect(`/listings/${objID}`);
  } catch (err) {
    console.log(err);
    res.send("Try again later");
  }
});

//listing review page render
app.get("/listing/review/new/:id", (req, res) => {
  let listingID = req.params.id;
  res.render("newReview", { listingID });
});

// add review db
app.post("/listing/review/:id", reviewValidation, async (req, res) => {
  const reviewData = req.body.listingReview;
  try {
    await listingReview.create(reviewData);
    return res.redirect(`/listings/${req.params.id}`);
  } catch (reviewError) {
    console.log(reviewError);
    res.render("Error", { reviewError, error: null });
  }
});

//listing delete route
app.delete("/listing/delete/:id", async (req, res) => {
  const userID = req.params.id;
  try {
    await listingReview.deleteMany({ listingID: userID });
    await list.findByIdAndDelete(userID);
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.send("Try again later");
  }
});

//review from db to client
const getReviews = async (userID) => {
  return await listingReview.find({ listingID: userID });
};

// delete review
app.post("/review/delete/:reviewId/:listingID", async (req, res) => {
  const reviewID = req.params.reviewId;
  const listingID = req.params.listingID;
  try {
    await listingReview.findByIdAndDelete(reviewID);
    res.redirect(`/listings/${listingID}`);
  } catch (deleteReviewError) {
    console.log(deleteReviewError);
    res.render("Error", { deleteReviewError, error: null, reviewError: null });
  }
});

//get listing by id
app.get("/listings/:id", async (req, res) => {
  const userID = req.params.id;
  if (!mongoose.isValidObjectId(userID)) {
    res.status(400).render("Error", {
      invalidID,
      error: null,
      reviewError: null,
      error1: ull,
    });
    return;
  }
  const listingData = await list.findById(userID);
  if (!listingData) {
    res.status(400).render("Error", {
      idNotFound,
      invalidID: null,
      error: null,
      reviewError: null,
      error1: ull,
    });
    return;
  }
  const reviewData = await getReviews(userID);
  res.render("displayid", { listingData, reviewData });
});

app.get((req, res) => {
  res.status(404).send("Page not found");
});
