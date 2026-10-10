import express from "express";
import methodOverride from "method-override";
import connectDB from "./config_DB/DBconnection.js";
import list from "./config_DB/models/listingsSchema.js";
import listingRoute from "./routes/listingRoutes.js";
import reviewRoute from "./routes/reviewRoutes.js";
import session from "express-session";
import userAccountRoute from "./routes/userAccountRoute.js";
import { authenticationCheck } from "./customMiddlewares.js";
import { errorHandler } from "./customMiddlewares.js";
import passport from "passport";
import LocalStrategy from "passport-local";
import userAccount from "./config_DB/models/userAccountSchema.js";
import "dotenv/config";
import cors from "cors";
import bookingRoute from "./routes/bookingRoute.js";

//disable or enable AUTHN for development purpose
// import MongoStore from "connect-mongo";

//middlewares
const app = express();
const PORT = process.env.PORT || 8080;
const sessionOptions = {
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,

  // disable or enable AUTHN for development purpose
  // store: MongoStore.create({
  //   mongoUrl: process.env.MONGO_URL,
  // }),


  cookie: {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  },

};
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(session(sessionOptions));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(userAccount.authenticate()));
passport.serializeUser(userAccount.serializeUser());
passport.deserializeUser(userAccount.deserializeUser());

//connect DB and server
connectDB()
  .then(() => {
    console.log("DataBase Connected Successfully");
    app.listen(PORT, "0.0.0.0", () => {
      console.log("Server Live");
    });
  })
  .catch((err) => {
    console.log("DataBase Connection Error-", err);
  });

//get listings
app.get("/", authenticationCheck, async (req, res) => {
  const userData = await list.find({});
  res.json({ userData });
});

app.use("/listing", listingRoute);
app.use("/review", reviewRoute);
app.use("/user", userAccountRoute);
app.use("/booking", bookingRoute);

app.use(errorHandler);
app.get((req, res) => {
  res.status(404).send("Page not found");
});
