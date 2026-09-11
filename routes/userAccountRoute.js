import express from "express";
import { userValidation } from "../customMiddlewares.js";
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
  passport.authenticate("local", {
    failureRedirect: "/user/loginpage",
    failureFlash: "Invalid username or password.",
  }),
  (req, res) => {
    res.redirect("/");
  },
);

//signup form
router.post("/signup", userValidation, signUp);

// session destroy account logout
router.post("/logout", logout);

export default router;
