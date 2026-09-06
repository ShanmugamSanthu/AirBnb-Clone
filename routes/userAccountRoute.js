import express from "express";
import userSchema from "../serverSchema/serverSchema.js";
import userAccount from "../config_DB/models/userAccountSchema.js";
const router = express.Router();

// user validation middleware
const userValidation = (req, res, next) => {
  const { error: userError } = userSchema.validate(req.body.user);
  if (userError) {
    res.render("Error", {
      userError,
      error: null,
      reviewError: null,
      error1: null,
      invalidID: null,
      idNotFound: null,
    });
  } else {
    next();
  }
};

//login page render
router.get("/loginpage", (req, res) => {
  res.render("login");
});

//signup page render
router.get("/signuppage", (req, res) => {
  res.render("signup");
});

//login form
router.post("/login", async (req, res) => {
  const result = await userAccount.findOne({
    userEmail: req.body.user.userEmail,
  });
  if (!result) {
    res.send("Account doesnt exists create an account");
    return;
  } else if (!(result.userPassword === req.body.user.userPassword)) {
    res.send("Password is incorrect try again");
    return;
  } else {
    req.session.userID = result._id;
    req.session.userName = result.userName;
    res.redirect("/");
  }
});

//signup form
router.post("/signup", async (req, res) => {
  const result = await userAccount.findOne({
    userEmail: req.body.user.userEmail,
  });
  if (result) {
    res.send("Email id exists login with the same id or signup with new email");
    return;
  } else {
    await userAccount.create(req.body.user);
    res.redirect("/user/loginpage");
  }
});

// session destroy account logout
router.post("/logout", (req, res) => {
  if (req.session.userID) {
    req.session.destroy((err) => {
      if (err) {
        res.send("couldnt logout try again later");
      } else {
        res.clearCookie("connect.sid", { path: "/" });
        res.redirect("/user/loginpage");
      }
    });
  }
});

export default router;
