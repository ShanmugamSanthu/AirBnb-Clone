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
  (req, res, next) => {
    req.session.save((err) => {
      if (err) {
        return next(err);
      }

      res.status(200).json({
        success: true,
        userName: req.user.username,
      });
    });
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
