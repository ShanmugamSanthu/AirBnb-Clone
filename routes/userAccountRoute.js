import express from "express";
import { userValidation } from "../customMiddlewares.js";
import userAccount from "../config_DB/models/userAccountSchema.js";
import ExpressError from "../error.js";
import passport from "passport";
const router = express.Router();

//login page render
router.get("/loginpage", (req, res) => {
  const error = req.flash("error");
  res.render("login");
});

//signup page render
router.get("/signuppage", (req, res) => {
  res.render("signup");
});

//login form
router.post(
  "/login",
  userValidation,
  passport.authenticate("local", {
    failureRedirect: "/user/loginpage",
    failureFlash: "Invalid username or password.",
  }),
  (req, res) => {
    res.redirect("/");
  },
);

//signup form
router.post("/signup", userValidation, async (req, res, next) => {
  const { username, password, userEmail } = req.body;
  console.log(username, password, userEmail);
  const data = { username, userEmail };
  const result = await userAccount.findOne({ userEmail });
  if (result) {
    const newErr = new ExpressError(
      "Email id exists login with the same id or signup with new email",
      400,
    );
    return next(newErr);
  } else {
    try {
      await userAccount.register(data, password);
      req.flash(
        "success",
        "Account created successfully login with same credentials",
      );
      res.redirect("/user/loginpage");
    } catch (err) {
      console.log(err);
      const newError = new ExpressError(
        "Username already taken try a different name",
        400,
      );
      next(newError);
    }
  }
});

// session destroy account logout
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      const newErr = new ExpressError("unable to logout", 500);
      return next(newErr);
    }
    req.session.destroy((err) => {
      if (err) {
        const newErr = new ExpressError("unable to logout", 500);
        return next(newErr);
      }
    });
    res.redirect("/user/loginpage");
  });
});

export default router;
