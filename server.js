import express from "express";
import methodOverride from "method-override";
import connectDB from "./config_DB/DBconnection.js";
import list from "./config_DB/models/listingsSchema.js";
import sampleListings from "./init/data.js";
import engine from "ejs-mate";
import listingsSchema from "./serverSchema.js";

//middlewares
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", engine);

//validation middleware
const validation = (req, res, next) => {
  const { error } = listingsSchema.validate(req.body.listing);
  if (error) {
    return res.render("Error", { error }); // separte error page
  }
  next();
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
//test insert
app.get("/test", async (req, res) => {
  await list.insertMany(sampleListings);

  console.log("saved");

  res.send("Saved");
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
app.post("/listing/new/add", validation, async (req, res) => {
  try {
    await list.create(listingData);
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
app.patch("/listing/edit/update", validation, async (req, res) => {
  try {
    await list.findByIdAndUpdate(listingData.ID, listingData);
    res.redirect(`/listings/${listingData.ID}`);
  } catch (err) {
    console.log(err);
    res.send("Try again later");
  }
});

//listing delete route
app.delete("/listing/delete/:id", async (req, res) => {
  const userID = req.params.id;
  try {
    await list.findByIdAndDelete(userID);
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.send("Try again later");
  }
});

//get listing by id
app.get("/listings/:id", async (req, res) => {
  const userID = req.params.id;
  const userData = await list.findById(userID);
  res.render("displayid", { userData });
});
