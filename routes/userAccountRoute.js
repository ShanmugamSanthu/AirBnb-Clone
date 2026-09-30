import express from "express";
import { userValidation, verifyEmail } from "../customMiddlewares.js";
import {
  loginForm,
  signUpForm,
  signUp,
  logout,
} from "../controller/userControl.js";
import passport from "passport";

const router = express.Router();

//login page render
router.get("/loginpage", loginForm);

//signup page render
router.get("/signuppage", signUpForm);

//login form
router.post(
  "/login",
  userValidation,
  verifyEmail,
  passport.authenticate("local", {
    failWithError: true,
  }),
  (err, req, res, next) => {
    if (err) {
      if (err.statusCode === 400 || err.statusCode === 403) {
        return next(err);
      }

      return res.status(401).json("Invalid username or password");
    }

    next();
  },
  (req, res) => {
    res.redirect("/");
  },
);

//name render
router.get("/current-user", (req, res) => {
  res.json({
    userName: req.user?.username || null,
  });
});

//signup form
router.post("/signup", userValidation, signUp);

// session destroy account logout
router.post("/logout", logout);

export default router;
