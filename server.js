import express from "express";
import methodOverride from "method-override";
import connectDB from "./config_DB/DBconnection.js";
import engine from "ejs-mate";
import list from "./config_DB/models/listingsSchema.js";
import listingRoute from "./routes/listingRoutes.js";
import reviewRoute from "./routes/reviewRoutes.js";
import session from "express-session";
import userAccountRoute from "./routes/userAccountRoute.js";
import { authorizationCheck } from "./customMiddlewares.js";

//middlewares
const app = express();
const sessionOptions = {
  secret: "secretKey",
  resave: false,
  saveUninitialized: false,

  cookie: {
    httpOnly: true,
    sameSite: "lax",
  },
};

app.use(session(sessionOptions));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", engine);
app.use((req, res, next) => {
  res.locals.userName = req.session.userName;
  next();
});

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

//get listings
app.get("/", authorizationCheck, async (req, res) => {
  const userData = await list.find({});
  res.render("index", { userData });
});

app.use("/listing", listingRoute);
app.use("/review", reviewRoute);
app.use("/user", userAccountRoute);

app.get((req, res) => {
  res.status(404).send("Page not found");
});
